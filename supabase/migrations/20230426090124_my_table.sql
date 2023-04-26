create type "auth"."code_challenge_method" as enum ('s256', 'plain');

drop index if exists "auth"."refresh_tokens_token_idx";

create table "auth"."flow_state" (
    "id" uuid not null,
    "user_id" uuid,
    "auth_code" text not null,
    "code_challenge_method" auth.code_challenge_method not null,
    "code_challenge" text not null,
    "provider_type" text not null,
    "provider_access_token" text,
    "provider_refresh_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" text not null
);


CREATE UNIQUE INDEX flow_state_pkey ON auth.flow_state USING btree (id);

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);

alter table "auth"."flow_state" add constraint "flow_state_pkey" PRIMARY KEY using index "flow_state_pkey";


drop function if exists "public"."search_posts_by_condition"(tags bigint[], host_name text[], post_name text[]);

drop function if exists "public"."create_appointment"(postid integer, title text, location text, description text, tags integer[], start_time timestamp without time zone, end_time timestamp without time zone, images text[], pending_user_id text[], owner_id text);

drop function if exists "public"."end_appointment"(end_id integer);

drop function if exists "public"."get_appointments_by_user_id_which_pending"(id text);

drop function if exists "public"."update_accept_appointment_by_appointment_id"(id integer, user_id text);

drop function if exists "public"."update_reject_appointment_by_appointment_id"(id integer, user_id text);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_email(sender text, recipient text, subject text, html_body text)
 RETURNS text
 LANGUAGE sql
AS $function$
  select send_email_message(to_jsonb(message))
  from (
      select send_email.sender as sender, 
      send_email.recipient as recipient, 
      send_email.subject as subject, 
      send_email.html_body as html_body
    ) as message 
$function$
;

CREATE OR REPLACE FUNCTION public.create_appointment(postid integer, title text, location text, description text, tags integer[], start_time timestamp without time zone, end_time timestamp without time zone, images text[], pending_user_id text[], owner_id text)
 RETURNS TABLE(email text[], appt_name text, appt_host text)
 LANGUAGE sql
AS $function$
  insert into appointment (title, location, description, tags, start_time, end_time, images, pending_user_id, owner_id, accept_user_id)
  values (title, location, description, tags, start_time, end_time, images, pending_user_id, owner_id, array[owner_id]);

  delete from post where post.id = postid;

   select array_agg(b.email) as email, title as appt_name, array_agg(distinct c.username) as appt_host
   from
    (select unnest(pending_user_id) as pending_user_id , create_appointment.owner_id as owner_id) a
     left join (select * from public.user) b on a.pending_user_id = b.id
     left join (select * from public.user) c on a.owner_id = c.id
$function$
;

CREATE OR REPLACE FUNCTION public.end_appointment(end_id integer)
 RETURNS TABLE(email text[], appt_name text, appt_host text)
 LANGUAGE sql
AS $function$
  UPDATE appointment
  SET is_end = True
  WHERE id = end_id;

  select array_agg(a.email) as email, array_agg(distinct title) as appt_name, array_agg(distinct b.username) as appt_host
    from (select unnest(accept_user_id) as user_id, title, owner_id from appointment where id = end_id) accepted_user 
    left join (select * from public.user) a
    on accepted_user.user_id = a.id
    left join (select * from public.user) b
    on accepted_user.owner_id = b.id
$function$
;

CREATE OR REPLACE FUNCTION public.get_appointments_by_user_id_which_pending(id text)
 RETURNS TABLE(id integer, start_time timestamp without time zone, end_time timestamp without time zone, owner_id text, location text, title text, description text, images text[], username text, image text, participant_number integer, tags text[], pending_user_names text[], accept_user_names text[], reject_user_names text[])
 LANGUAGE sql
AS $function$
    select appointment.id as id, start_time, end_time, owner_id, location, title, appointment.description as description, images, username, image, 
    array_length(accept_user_id, 1) as participant_number, 
    coalesce(tag_names, '{}'::text[]) as tags, 
    coalesce(pending_user_name, '{}'::text[]) as pending_user_names,
    coalesce(accept_user_name, '{}'::text[]) as accept_user_names, 
    coalesce(reject_user_name, '{}'::text[]) as reject_user_names

    from appointment inner join public.user 
    on appointment.owner_id = public.user.id 
    
    left join (
        select a.id as appointment_id, array_agg(name) as tag_names 
        from (select id, unnest(tags) as tag_id from appointment) as a 
        left join tag 
        on a.tag_id = tag.id group by appointment_id
    ) as tag_name on tag_name.appointment_id = appointment.id 
    
    left join (
        select b.id as appointment_id, array_agg(public.user.username) as accept_user_name 
        from (select id, unnest(accept_user_id) as accept_id from appointment) as b 
        left join public.user
        on b.accept_id = public.user.id group by appointment_id
    ) as accept_name on accept_name.appointment_id = appointment.id

    left join (
        select c.id as appointment_id, array_agg(public.user.username) as reject_user_name
        from (select id, unnest(reject_user_id) as reject_id from appointment) as c 
        left join public.user
        on c.reject_id = public.user.id group by appointment_id
    ) as reject_name on reject_name.appointment_id = appointment.id

    left join (
        select d.id as appointment_id, array_agg(public.user.username) as pending_user_name
        from (select id, unnest(pending_user_id) as pending_id from appointment) as d 
        left join public.user
        on d.pending_id = public.user.id group by appointment_id
    ) as pending_name on pending_name.appointment_id = appointment.id

    where get_appointments_by_user_id_which_pending.id = any(appointment.pending_user_id) 
    and get_appointments_by_user_id_which_pending.id != appointment.owner_id
$function$
;

CREATE OR REPLACE FUNCTION public.send_email_sendinblue(message jsonb)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  retval json;
  SENDINBLUE_API_KEY text;
BEGIN
  SELECT value::text INTO SENDINBLUE_API_KEY FROM private.keys WHERE key = 'SENDINBLUE_API_KEY';
  IF NOT found THEN RAISE 'missing entry in private.keys: SENDINBLUE_API_KEY'; END IF;

    SELECT
        * INTO retval
    FROM
        http 
        ((
            'POST', 
            'https://api.sendinblue.com/v3/smtp/email', 
            ARRAY[http_header ('api-key', SENDINBLUE_API_KEY)], 
            'application/json',
            json_build_object(
              'sender', json_build_object('name', message->>'sender', 'email', message->>'sender'),
              'to', 
                json_build_array(
                  json_build_object('name', message->>'receipient', 'email', message->>'recipient')
                ),
              'subject', message->>'subject',
              'htmlContent', message->>'html_body',
              'textContent', message->>'text_body',
              'tags', json_build_array(
                  message->>'messageid'
                )
            )::text
          
        ));

        -- if the message table exists, 
        -- and the response from the mail server contains an id
        -- and the message from the mail server starts wtih 'Queued'
        -- mark this message as 'queued' in our message table, otherwise leave it as 'ready'
        
        IF (SELECT to_regclass('public.messages')) IS NOT NULL AND 
            retval::text = '201' THEN 
          UPDATE public.messages SET status = 'queued' WHERE id = (message->>'messageid')::UUID;
        ELSE
          RAISE 'error sending message with sendinblue: %',retval;
        END IF;

  RETURN retval;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_accept_appointment_by_appointment_id(id integer, user_id text)
 RETURNS TABLE(email text, accept_user text, appt_name text)
 LANGUAGE sql
AS $function$
    update appointment
    set accept_user_id = array_append(accept_user_id, user_id)
    where id = update_accept_appointment_by_appointment_id.id;

    update appointment
    set pending_user_id = array_remove(pending_user_id, user_id)
    where id = update_accept_appointment_by_appointment_id.id; 

    select d.email as email, b.username as accept_user, c.title as appt_name from
    (select user_id, update_accept_appointment_by_appointment_id.id as appointment_id) a
      left join (select * from public.user) b on a.user_id = b.id
      left join (select * from appointment) c on a.appointment_id = c.id
      left join (select * from public.user) d on c.owner_id = d.id
$function$
;

CREATE OR REPLACE FUNCTION public.update_reject_appointment_by_appointment_id(id integer, user_id text)
 RETURNS TABLE(email text, reject_user text, appt_name text)
 LANGUAGE sql
AS $function$
    update appointment
    set reject_user_id = array_append(reject_user_id, user_id)
    where id = update_reject_appointment_by_appointment_id.id;

    update appointment
    set pending_user_id = array_remove(pending_user_id, user_id)
    where id = update_reject_appointment_by_appointment_id.id;

    select d.email as email, b.username as reject_user, c.title as appt_name from
    (select user_id, update_reject_appointment_by_appointment_id.id as appointment_id) a
      left join (select * from public.user) b on a.user_id = b.id
      left join (select * from appointment) c on a.appointment_id = c.id
      left join (select * from public.user) d on c.owner_id = d.id
$function$
;


create policy "main ke1ljm_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "main ke1ljm_1"
on "storage"."objects"
as permissive
for select
to authenticated
using (true);


create policy "main ke1ljm_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (true);


create policy "main ke1ljm_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);



