SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_net; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";


--
-- Name: pgsodium; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";


--
-- Name: private; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA "private";


ALTER SCHEMA "private" OWNER TO "postgres";

--
-- Name: http; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "public";


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: pgtap; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgtap" WITH SCHEMA "extensions";


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: participant_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."participant_type" AS (
	"id" "text",
	"username" "text",
	"is_verified" boolean,
	"birthdate" "date",
	"description" "text",
	"image" "text",
	"sex" "text"
);


ALTER TYPE "public"."participant_type" OWNER TO "postgres";

--
-- Name: participants_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."participants_type" AS (
	"id" "text",
	"username" "text",
	"is_verified" boolean,
	"birthdate" "date",
	"description" "text",
	"image" "text"
);


ALTER TYPE "public"."participants_type" OWNER TO "postgres";

--
-- Name: tags_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."tags_type" AS (
	"id" integer,
	"name" "text"
);


ALTER TYPE "public"."tags_type" OWNER TO "postgres";

--
-- Name: add_participant_id_to_post_id("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."add_participant_id_to_post_id"("user_id" "text", "post_id" integer) RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update post set participants = array_append(participants, add_participant_id_to_post_id.user_id) where post_id = id;
$$;


ALTER FUNCTION "public"."add_participant_id_to_post_id"("user_id" "text", "post_id" integer) OWNER TO "postgres";

--
-- Name: create_advertisement("text", timestamp with time zone, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$insert into advertisement (title, end_date, image_url)
values (title, end_date, image_url)$$;


ALTER FUNCTION "public"."create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text") OWNER TO "postgres";

--
-- Name: create_appointment(integer, "text", "text", "text", integer[], timestamp without time zone, timestamp without time zone, "text"[], "text"[], "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  insert into appointment (title, location, description, tags, start_time, end_time, images, pending_user_id, owner_id, accept_user_id)
  values (title, location, description, tags, start_time, end_time, images, pending_user_id, owner_id, array[owner_id]);

  delete from post where post.id = postid;
$$;


ALTER FUNCTION "public"."create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text") OWNER TO "postgres";

--
-- Name: create_post("text", "text", "text", integer[], timestamp without time zone, timestamp without time zone, "text"[], "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  insert into post (title, location, description, tags, start_time, end_time, images, owner_id)
  values (title, location, description, tags, start_time, end_time, images, owner_id)
$$;


ALTER FUNCTION "public"."create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text") OWNER TO "postgres";

--
-- Name: create_review("text", integer, integer, "text", boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean) RETURNS "void"
    LANGUAGE "sql"
    AS $$
INSERT INTO review (description, score, appointment_id, reviewer_id, is_anonymous)
VALUES (create_review.description, create_review.score, create_review.appointment_id, create_review.reviewer_id, create_review.is_anonymous);
$$;


ALTER FUNCTION "public"."create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean) OWNER TO "postgres";

--
-- Name: create_user("text", "text", "text", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
    insert 
    into public.user (id, username, password, email, birthdate, sex)   
    values (id, username, password, email, Date(birthdate), sex);
$$;


ALTER FUNCTION "public"."create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text") OWNER TO "postgres";

--
-- Name: delete_post_by_post_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."delete_post_by_post_id"("id" integer) RETURNS "void"
    LANGUAGE "sql"
    AS $$
  delete from post where post.id = delete_post_by_post_id.id;
$$;


ALTER FUNCTION "public"."delete_post_by_post_id"("id" integer) OWNER TO "postgres";

--
-- Name: end_appointment(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."end_appointment"("end_id" integer) RETURNS "void"
    LANGUAGE "sql"
    AS $$
   UPDATE appointment
   SET is_end = True
  WHERE id = end_id;
$$;


ALTER FUNCTION "public"."end_appointment"("end_id" integer) OWNER TO "postgres";

--
-- Name: get_advertisement(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_advertisement"() RETURNS TABLE("image_url" "text")
    LANGUAGE "sql"
    AS $$
   SELECT image_url FROM advertisement WHERE end_date > NOW() ORDER BY RANDOM() LIMIT 10;
$$;


ALTER FUNCTION "public"."get_advertisement"() OWNER TO "postgres";

--
-- Name: get_appointment_by_appointment_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_appointment_by_appointment_id"("id" integer) RETURNS TABLE("id" integer, "start_time" timestamp with time zone, "end_time" timestamp with time zone, "owner_id" "text", "location" "text", "title" "text", "description" "text", "images" "text"[], "username" "text", "image" "text", "participant_number" integer, "tags" "text"[], "pending_user" "json"[], "accept_user" "json"[], "reject_user" "json"[])
    LANGUAGE "sql"
    AS $$
select appointment.id, start_time, end_time, owner_id, location, title, appointment.description as description, images, username, image, array_length(accepted_users, 1) as participant_number, coalesce(tag_names, '{}'::text[]) as tags, coalesce(pending_users, '{}'::json[]) as pending_user, coalesce(accepted_users, '{}'::json[]) as accept_user, coalesce(rejected_users, '{}'::json[]) as rejected_user from public.user,
appointment
left join
(select c1.appointment_id, accepted_users, pending_users, rejected_users from
(select a1.appointment_id, accepted_users, pending_users from
(select appointment_id, array_agg(user_json) as accepted_users from (select appointment_id, to_json(row(public.user.id, username, national_id is not null, birthdate, description, image, sex)::participant_type) as user_json from (select id as appointment_id, unnest(accept_user_id) as uid from appointment) my_user join public.user on uid = public.user.id) a group by appointment_id) a1
full join
(select appointment_id, array_agg(user_json) as pending_users from (select appointment_id, to_json(row(public.user.id, username, national_id is not null, birthdate, description, image, sex)::participant_type) as user_json from (select id as appointment_id, unnest(pending_user_id) as uid from appointment) my_user join public.user on uid = public.user.id) a group by appointment_id) b1
on a1.appointment_id = b1.appointment_id) c1
full join
(select appointment_id, array_agg(user_json) as rejected_users from (select appointment_id, to_json(row(public.user.id, username, national_id is not null, birthdate, description, image, sex)::participant_type) as user_json from (select id as appointment_id, unnest(reject_user_id) as uid from appointment) my_user join public.user on uid = public.user.id) a group by appointment_id) d1
on c1.appointment_id = d1.appointment_id) e1
on appointment.id = e1.appointment_id
full join
(select appointment_id, array_agg(tag_name) as tag_names from (select appointment_id, name as tag_name from (select id as appointment_id, unnest(tags) as tag_id from appointment) g1 join tag on tag.id = tag_id) h1 group by appointment_id) f1
on appointment.id = f1.appointment_id
where public.user.id = appointment.owner_id and appointment.id = get_appointment_by_appointment_id.id
$$;


ALTER FUNCTION "public"."get_appointment_by_appointment_id"("id" integer) OWNER TO "postgres";

--
-- Name: get_appointment_to_rate("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_appointment_to_rate"("id" "text") RETURNS TABLE("id" integer, "start_time" timestamp with time zone, "end_time" timestamp with time zone, "owner_id" "text", "location" "text", "title" "text", "description" "text", "tags" integer[], "images" "text"[], "pending_user_id" "text"[], "accept_user_id" "text"[], "reject_user_id" "text"[], "username" "text", "image" "text", "participant_number" integer)
    LANGUAGE "sql"
    AS $$
   select appointment.id as id, start_time, end_time, owner_id, location, title, appointment.description as description, tags, images, pending_user_id, accept_user_id, reject_user_id, username, image, array_length(accept_user_id, 1) as participant_number
  from appointment inner join public.user
  on appointment.owner_id = public.user.id  
  where get_appointment_to_rate.id = ANY(appointment.accept_user_id) and owner_id != get_appointment_to_rate.id and appointment.is_end=True  ;
$$;


ALTER FUNCTION "public"."get_appointment_to_rate"("id" "text") OWNER TO "postgres";

--
-- Name: get_appointments_by_user_id("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_appointments_by_user_id"("id" "text") RETURNS TABLE("id" integer, "start_time" timestamp with time zone, "end_time" timestamp with time zone, "owner_id" "text", "location" "text", "title" "text", "description" "text", "tags" integer[], "images" "text"[], "pending_user_id" "text"[], "accept_user_id" "text"[], "reject_user_id" "text"[], "username" "text", "image" "text", "participant_number" integer)
    LANGUAGE "sql"
    AS $$
   select appointment.id as id, start_time, end_time, owner_id, location, title, appointment.description as description, tags, images, pending_user_id, accept_user_id, reject_user_id, username, image, array_length(accept_user_id, 1) as participant_number
  from appointment inner join public.user
  on appointment.owner_id = public.user.id  
  where (get_appointments_by_user_id.id = ANY(appointment.accept_user_id) or owner_id = get_appointments_by_user_id.id)and appointment.is_end=False ;
$$;


ALTER FUNCTION "public"."get_appointments_by_user_id"("id" "text") OWNER TO "postgres";

--
-- Name: get_appointments_by_user_id_which_pending("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_appointments_by_user_id_which_pending"("id" "text") RETURNS TABLE("id" "text", "start_time" timestamp without time zone, "end_time" timestamp without time zone, "owner_id" "text", "location" "text", "title" "text", "description" "text", "images" "text"[], "username" "text", "image" "text", "participant_number" integer, "tags" "text"[], "pending_user_names" "text"[], "accept_user_names" "text"[], "reject_user_names" "text"[])
    LANGUAGE "sql"
    AS $$

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
$$;


ALTER FUNCTION "public"."get_appointments_by_user_id_which_pending"("id" "text") OWNER TO "postgres";

--
-- Name: get_is_email_exist("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_is_email_exist"("email" "text") RETURNS boolean
    LANGUAGE "sql"
    AS $$
  select exists(select * from public.user where public.user.email = get_is_email_exist.email);
$$;


ALTER FUNCTION "public"."get_is_email_exist"("email" "text") OWNER TO "postgres";

--
-- Name: get_is_user_reviewed_appointment("text", bigint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint) RETURNS boolean
    LANGUAGE "sql"
    AS $$SELECT exists(
  SELECT *
  FROM review
  WHERE reviewer_id = get_is_user_reviewed_appointment.user_id AND appointment_id = get_is_user_reviewed_appointment.appointment_id
);$$;


ALTER FUNCTION "public"."get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint) OWNER TO "postgres";

--
-- Name: get_post_by_post_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_post_by_post_id"("id" integer) RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "tags" integer[], "tag_names" "text"[], "images" "text"[])
    LANGUAGE "sql"
    AS $$
    select c.id,title,c.description,owner_id,username as owner_name,public.user.image as owner_profile,location,start_time,end_time,tags,coalesce(tag_names, '{}'::text[]) as tag_names,images from (select * from post left join 
  (select a.id as post_id, array_agg(name) as tag_names from (select id, unnest(tags) as tag_id from post) as a left join tag on a.tag_id = tag.id group by post_id) as subquery on post.id = subquery.post_id) as c left join public.user on public.user.id = owner_id where c.id = get_post_by_post_id.id;
$$;


ALTER FUNCTION "public"."get_post_by_post_id"("id" integer) OWNER TO "postgres";

--
-- Name: get_post_with_participants_by_post_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_post_with_participants_by_post_id"("id" integer) RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "images" "text"[], "tags" "json"[], "participants" "json"[])
    LANGUAGE "sql"
    AS $$
  select post.id, title, post.description, owner_id, username as owner_name, image as owner_profile, post.location, start_time, end_time, post.images, coalesce(c.tags, '{}'::json[]) as tags, coalesce(c.participants, '{}'::json[]) as participants from (select tags, participants from (select array_agg(tag) as tags from (select to_json(sub_tag) as tag from (select * from (select unnest(tags) as id from post where post.id = get_post_with_participants_by_post_id.id) as target_tag natural join tag) sub_tag) tags) a, (select array_agg(p.participants) as participants from (select to_json(sub_participant) as participants from (select public.user.id, username, sex, national_id is not null as is_verified, birthdate, description, image from (select unnest(participants) as id from post where post.id = get_post_with_participants_by_post_id.id) as target_user natural join public.user) sub_participant) p) b) c, post, public.user where public.user.id = post.owner_id and post.id = get_post_with_participants_by_post_id.id;
$$;


ALTER FUNCTION "public"."get_post_with_participants_by_post_id"("id" integer) OWNER TO "postgres";

--
-- Name: get_posts(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_posts"() RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "tags" integer[], "tag_names" "text"[], "images" "text"[])
    LANGUAGE "sql"
    AS $$
  select c.id,title,c.description,owner_id,username as owner_name,public.user.image as owner_profile,location,start_time,end_time,tags,coalesce(tag_names, '{}'::text[]) as tag_names,images from (select * from post left join 
  (select a.id as post_id, array_agg(name) as tag_names from (select id, unnest(tags) as tag_id from post) as a left join tag on a.tag_id = tag.id group by post_id) as subquery on post.id = subquery.post_id) as c left join public.user on public.user.id = owner_id;
$$;


ALTER FUNCTION "public"."get_posts"() OWNER TO "postgres";

--
-- Name: get_posts_by_user_id("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_posts_by_user_id"("id" "text") RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "tags" integer[], "tag_names" "text"[], "images" "text"[])
    LANGUAGE "sql"
    AS $$
    select c.id,title,c.description,owner_id,username as owner_name,public.user.image as owner_profile,location,start_time,end_time,tags,coalesce(tag_names, '{}'::text[]) as tag_names,images from (select * from post left join 
  (select a.id as post_id, array_agg(name) as tag_names from (select id, unnest(tags) as tag_id from post) as a left join tag on a.tag_id = tag.id group by post_id) as subquery on post.id = subquery.post_id) as c left join public.user on public.user.id = owner_id where owner_id = get_posts_by_user_id.id;
$$;


ALTER FUNCTION "public"."get_posts_by_user_id"("id" "text") OWNER TO "postgres";

--
-- Name: get_posts_with_participants(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_posts_with_participants"() RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "images" "text"[], "tags" "json"[], "participants" "json"[])
    LANGUAGE "sql"
    AS $$
  select post.id, title, post.description, owner_id, username as owner_name, image as owner_profile, post.location, start_time, end_time, post.images, coalesce(sub_tags.tags, '{}'::json[]) as tags, coalesce(sub_participants.participants, '{}'::json[]) as participants from post left join (select post_id, array_agg(participant) as participants from (select post_id, to_json(row(public.user.id, username, national_id is not null, birthdate, description, image, sex)::participant_type) as participant from (select id as post_id, unnest(participants) as id from post) target_participant join public.user on target_participant.id = public.user.id) sub_participant group by post_id) sub_participants on post.id = sub_participants.post_id left join (select post_id, array_agg(tag) as tags from (select post_id, to_json(row(id, name)::tags_type) as tag from (select id as post_id, unnest(tags) as id from post) target_tags natural join tag) sub_tag group by post_id) sub_tags on sub_tags.post_id = post.id, public.user where public.user.id = post.owner_id
$$;


ALTER FUNCTION "public"."get_posts_with_participants"() OWNER TO "postgres";

--
-- Name: get_review_by_reviewer_and_appointment_id("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer) RETURNS TABLE("id" integer, "description" "text", "score" integer, "is_anonymous" boolean)
    LANGUAGE "sql"
    AS $$
SELECT id, description, score, is_anonymous
FROM review 
WHERE reviewer_id = get_review_by_reviewer_and_appointment_id.reviewer_id AND appointment_id = get_review_by_reviewer_and_appointment_id.appointment_id;
$$;


ALTER FUNCTION "public"."get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer) OWNER TO "postgres";

--
-- Name: get_reviews_by_reviewee_id("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_reviews_by_reviewee_id"("id" "text") RETURNS TABLE("id" integer, "reviewer_name" "text", "description" "text", "score" integer, "appointment_title" "text", "is_anonymous" boolean)
    LANGUAGE "sql"
    AS $$
SELECT r.id, u.username AS reviewer_name, r.description, r.score, a.title AS appointment_title, r.is_anonymous
FROM review r
JOIN "user" u ON r.reviewer_id = u.id
JOIN appointment a ON r.appointment_id = a.id
WHERE a.owner_id = get_reviews_by_reviewee_id.id;
$$;


ALTER FUNCTION "public"."get_reviews_by_reviewee_id"("id" "text") OWNER TO "postgres";

--
-- Name: get_tags(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_tags"() RETURNS TABLE("id" integer, "name" "text")
    LANGUAGE "sql"
    AS $$
  select * from tag ;
$$;


ALTER FUNCTION "public"."get_tags"() OWNER TO "postgres";

--
-- Name: get_user_by_user_id("text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."get_user_by_user_id"("id" "text") RETURNS TABLE("id" "text", "username" "text", "email" "text", "birthdate" "text", "sex" "text", "description" "text", "is_admin" boolean, "is_enabled" boolean, "image" "text", "rating_score" integer, "is_verified" boolean)
    LANGUAGE "sql"
    AS $$
  select id, username, email, birthdate, sex, description, is_admin, is_enabled, image, rating_score, national_id is not null as is_verified
  from public.user 
  where public.user.id = get_user_by_user_id.id;
$$;


ALTER FUNCTION "public"."get_user_by_user_id"("id" "text") OWNER TO "postgres";

--
-- Name: remove_participant_id_from_post_id("text", integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."remove_participant_id_from_post_id"("user_id" "text", "post_id" integer) RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update post set participants = array_remove(participants, remove_participant_id_from_post_id.user_id) where post_id = id;
$$;


ALTER FUNCTION "public"."remove_participant_id_from_post_id"("user_id" "text", "post_id" integer) OWNER TO "postgres";

--
-- Name: search_posts_by_condition(bigint[], "text"[], "text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]) RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "images" "text"[], "tags" integer[], "participants" "text"[], "owner_name" "text", "owner_profile" "text")
    LANGUAGE "sql"
    AS $$
  select post.id, post.title, post.description, post.owner_id, post.location, post.start_time, post.end_time, post.images, post.tags, post.participants, 
  public.user.username as owner_name, public.user.image as owner_profile 
  from post left join public.user on post.owner_id = public.user.id
  WHERE search_posts_by_condition.tags <@ post.tags
  and public.user.username like ALL(SELECT '%'||unnest(host_name)||'%' FROM  generate_series(1,array_length(array[''],1)))
  and post.title like ALL(SELECT '%'||unnest(post_name)||'%' FROM  generate_series(1,array_length(array[''],1)))
$$;


ALTER FUNCTION "public"."search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]) OWNER TO "postgres";

--
-- Name: search_posts_by_conditions(bigint[], "text"[], "text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]) RETURNS TABLE("id" integer, "title" "text", "description" "text", "owner_id" "text", "owner_name" "text", "owner_profile" "text", "location" "text", "start_time" timestamp with time zone, "end_time" timestamp with time zone, "images" "text"[], "tags" "json"[], "participants" "json"[])
    LANGUAGE "sql"
    AS $$
 select post.id, post.title, post.description, post.owner_id, public.user.username as owner_name, public.user.image as owner_profile, post.location, post.start_time, post.end_time, post.images, c.tags, coalesce(d.participants, '{}'::json[]) as participants
  from post left join public.user on post.owner_id = public.user.id
  left join (select b.id, array_agg(b.tag) as tags from (select a.id, to_json(row(tag.id, name)::tags_type) as tag from (select id, unnest(tags) as tag_id from post) a join tag on a.tag_id = tag.id) b group by b.id) c
  on post.id = c.id
  left join (select id, array_agg(participant) as participants from (select e.id, to_json(row(public.user.id, username, national_id is not null, birthdate, description, image, sex)::participant_type) as participant from (select id, unnest(participants) as pid from post) e, public.user where e.pid = public.user.id) f group by id) d
  on post.id = d.id
  WHERE tag_ids <@ post.tags
  and lower(public.user.username) like ALL(SELECT '%'||lower(unnest(host_names))||'%' FROM  generate_series(1,array_length(array[''],1)))
  and lower(post.title) like ALL(SELECT '%'||lower(unnest(post_names))||'%' FROM  generate_series(1,array_length(array[''],1)))
$$;


ALTER FUNCTION "public"."search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]) OWNER TO "postgres";

--
-- Name: send_email_message("jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."send_email_message"("message" "jsonb") RETURNS "json"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  -- variable declaration
  email_provider text := 'sendinblue'; -- 'mailgun', 'sendgrid', 'sendinblue', 'mailjet', 'mailersend'
  retval json;
  messageid text;
BEGIN


  IF message->'text_body' IS NULL AND message->'html_body' IS NULL THEN RAISE 'message.text_body or message.html_body is required'; END IF;
  
  IF message->'text_body' IS NULL THEN     
     select message || jsonb_build_object('text_body',message->>'html_body') into message;
  END IF;
  
  IF message->'html_body' IS NULL THEN 
     select message || jsonb_build_object('html_body',message->>'text_body') into message;
  END IF;  

  IF message->'recipient' IS NULL THEN RAISE 'message.recipient is required'; END IF;
  IF message->'sender' IS NULL THEN RAISE 'message.sender is required'; END IF;
  IF message->'subject' IS NULL THEN RAISE 'message.subject is required'; END IF;

  IF message->'messageid' IS NULL AND (SELECT to_regclass('public.messages')) IS NOT NULL THEN
    -- messages table exists, so save this message in the messages table
    INSERT INTO public.messages(recipient, sender, cc, bcc, subject, text_body, html_body, status, log)
    VALUES (message->'recipient', message->'sender', message->'cc', message->'bcc', message->'subject', message->'text_body', message->'html_body', 'ready', '[]'::jsonb) RETURNING id INTO messageid;
    select message || jsonb_build_object('messageid',messageid) into message;
  END IF;

  EXECUTE 'SELECT send_email_' || email_provider || '($1)' INTO retval USING message;
  -- SELECT send_email_mailgun(message) INTO retval;
  -- SELECT send_email_sendgrid(message) INTO retval;

  RETURN retval;
END;
$_$;


ALTER FUNCTION "public"."send_email_message"("message" "jsonb") OWNER TO "postgres";

--
-- Name: send_email_sendinblue("jsonb"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."send_email_sendinblue"("message" "jsonb") RETURNS "json"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  retval json;
  SENDINBLUE_API_KEY text;
BEGIN
  SELECT value::text INTO SENDINBLUE_API_KEY FROM private.keys WHERE key = 'SENDINBLUE_API_KEY';
  IF NOT found THEN RAISE 'missing entry in private.keys: SENDINBLUE_API_KEY'; END IF;

/*
curl --request POST \
  --url https://api.sendinblue.com/v3/smtp/email \
  --header 'accept: application/json' \
  --header 'api-key:YOUR_API_KEY' \
  --header 'content-type: application/json' \
  --data '{  
   "sender":{  
      "name":"Sender Alex",
      "email":"senderalex@example.com"
   },
   "to":[  
      {  
         "email":"testmail@example.com",
         "name":"John Doe"
      }
   ],
   "subject":"Hello world",
   "htmlContent":"<html><head></head><body><p>Hello,</p>This is my first transactional email sent from Sendinblue.</p></body></html>"
}'
*/
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
              'textConent', message->>'text_body',
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
$$;


ALTER FUNCTION "public"."send_email_sendinblue"("message" "jsonb") OWNER TO "postgres";

--
-- Name: update_accept_appointment_by_appointment_id(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
    update appointment
    set accept_user_id = array_append(accept_user_id, user_id)
    where id = update_accept_appointment_by_appointment_id.id;

    update appointment
    set pending_user_id = array_remove(pending_user_id, user_id)
    where id = update_accept_appointment_by_appointment_id.id;
$$;


ALTER FUNCTION "public"."update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text") OWNER TO "postgres";

--
-- Name: update_post_by_post_id(integer, "text", "text", integer[], timestamp without time zone, timestamp without time zone, "text", "text"[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]) RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update post
    set
      title = update_post_by_post_id.title,
      location = update_post_by_post_id.location,
      tags = update_post_by_post_id.tags,
      start_time = update_post_by_post_id.start_time,
      end_time = update_post_by_post_id.end_time,
      description = update_post_by_post_id.description,
      images = update_post_by_post_id.images
    where id = update_post_by_post_id.id ;
$$;


ALTER FUNCTION "public"."update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]) OWNER TO "postgres";

--
-- Name: update_reject_appointment_by_appointment_id(integer, "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
    update appointment
    set reject_user_id = array_append(reject_user_id, user_id)
    where id = update_reject_appointment_by_appointment_id.id;

    update appointment
    set pending_user_id = array_remove(pending_user_id, user_id)
    where id = update_reject_appointment_by_appointment_id.id;
$$;


ALTER FUNCTION "public"."update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text") OWNER TO "postgres";

--
-- Name: update_review(integer, "text", integer, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean) RETURNS "void"
    LANGUAGE "sql"
    AS $$
UPDATE review
SET description = update_review.description,
    score = update_review.score,
    is_anonymous = update_review.is_anonymous
WHERE id = update_review.id;
$$;


ALTER FUNCTION "public"."update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean) OWNER TO "postgres";

--
-- Name: update_user_by_user_id("text", "text", "text", "text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update public.user
  set
    username = COALESCE(update_user_by_user_id.username, username),
    sex = COALESCE(update_user_by_user_id.sex, sex),
    description = COALESCE(update_user_by_user_id.description, description),
    image = COALESCE(update_user_by_user_id.image, image)
  where id = update_user_by_user_id.id;
$$;


ALTER FUNCTION "public"."update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text") OWNER TO "postgres";

--
-- Name: update_user_national_id_by_user_id("text", "text"); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_user_national_id_by_user_id"("id" "text", "national_id" "text") RETURNS TABLE("is_exist_national_id" boolean)
    LANGUAGE "sql"
    AS $$
    WITH res AS (UPDATE public.user 
    SET national_id = update_user_national_id_by_user_id.national_id 
    WHERE id = update_user_national_id_by_user_id.id and not EXISTS(SELECT * FROM public.user WHERE national_id = update_user_national_id_by_user_id.national_id) RETURNING public.user.id)
    SELECT count(*) = 0 as is_exist_national_id from res;
$$;


ALTER FUNCTION "public"."update_user_national_id_by_user_id"("id" "text", "national_id" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: keys; Type: TABLE; Schema: private; Owner: postgres
--

CREATE TABLE "private"."keys" (
    "key" "text" NOT NULL,
    "value" "text"
);


ALTER TABLE "private"."keys" OWNER TO "postgres";

--
-- Name: advertisement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."advertisement" (
    "id" bigint NOT NULL,
    "title" "text",
    "image_url" "text",
    "end_date" timestamp with time zone
);


ALTER TABLE "public"."advertisement" OWNER TO "postgres";

--
-- Name: Advertisement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."advertisement" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Advertisement_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: appointment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."appointment" (
    "id" bigint NOT NULL,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "owner_id" "text",
    "location" "text",
    "title" "text",
    "description" "text",
    "tags" bigint[],
    "images" "text"[],
    "pending_user_id" "text"[],
    "reject_user_id" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "accept_user_id" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_end" boolean DEFAULT false
);


ALTER TABLE "public"."appointment" OWNER TO "postgres";

--
-- Name: Appointment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."appointment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Appointment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."post" (
    "id" bigint NOT NULL,
    "title" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text",
    "owner_id" "text" NOT NULL,
    "location" "text" DEFAULT ''::"text",
    "start_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_time" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tags" bigint[] DEFAULT '{}'::bigint[] NOT NULL,
    "images" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "participants" "text"[] DEFAULT '{}'::"text"[] NOT NULL
);


ALTER TABLE "public"."post" OWNER TO "postgres";

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."post" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Post_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."review" (
    "id" bigint NOT NULL,
    "reviewer_id" "text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "score" smallint NOT NULL,
    "appointment_id" bigint NOT NULL,
    "is_anonymous" boolean
);


ALTER TABLE "public"."review" OWNER TO "postgres";

--
-- Name: review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."review" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."review_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."tag" (
    "id" bigint NOT NULL,
    "name" "text"
);


ALTER TABLE "public"."tag" OWNER TO "postgres";

--
-- Name: tag_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE "public"."tag" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."tag_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."user" (
    "username" "text",
    "password" "text",
    "email" "text",
    "birthdate" "date",
    "sex" "text",
    "description" "text" DEFAULT ''::"text",
    "image" "text",
    "is_enabled" boolean DEFAULT true,
    "rating_score" numeric DEFAULT '0'::numeric,
    "id" "text" NOT NULL,
    "is_admin" boolean DEFAULT false NOT NULL,
    "national_id" "text"
);


ALTER TABLE "public"."user" OWNER TO "postgres";

--
-- Name: keys keys_pkey; Type: CONSTRAINT; Schema: private; Owner: postgres
--

ALTER TABLE ONLY "private"."keys"
    ADD CONSTRAINT "keys_pkey" PRIMARY KEY ("key");


--
-- Name: advertisement Advertisement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."advertisement"
    ADD CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id");


--
-- Name: appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");


--
-- Name: post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");


--
-- Name: user User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");


--
-- Name: tag tag_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."tag"
    ADD CONSTRAINT "tag_pkey1" PRIMARY KEY ("id");


--
-- Name: appointment appointment_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."appointment"
    ADD CONSTRAINT "appointment_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id");


--
-- Name: post fk_post_owner_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."post"
    ADD CONSTRAINT "fk_post_owner_id" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;


--
-- Name: review review_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointment"("id");


--
-- Name: review review_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."review"
    ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."user"("id") ON DELETE CASCADE;

--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

--
-- Name: FUNCTION "add_participant_id_to_post_id"("user_id" "text", "post_id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."add_participant_id_to_post_id"("user_id" "text", "post_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."add_participant_id_to_post_id"("user_id" "text", "post_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_participant_id_to_post_id"("user_id" "text", "post_id" integer) TO "service_role";


--
-- Name: FUNCTION "create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_advertisement"("title" "text", "end_date" timestamp with time zone, "image_url" "text") TO "service_role";


--
-- Name: FUNCTION "create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_appointment"("postid" integer, "title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "pending_user_id" "text"[], "owner_id" "text") TO "service_role";


--
-- Name: FUNCTION "create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_post"("title" "text", "location" "text", "description" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "images" "text"[], "owner_id" "text") TO "service_role";


--
-- Name: FUNCTION "create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_review"("description" "text", "score" integer, "appointment_id" integer, "reviewer_id" "text", "is_anonymous" boolean) TO "service_role";


--
-- Name: FUNCTION "create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_user"("id" "text", "username" "text", "password" "text", "email" "text", "birthdate" "text", "sex" "text") TO "service_role";


--
-- Name: FUNCTION "delete_post_by_post_id"("id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."delete_post_by_post_id"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."delete_post_by_post_id"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_post_by_post_id"("id" integer) TO "service_role";


--
-- Name: FUNCTION "end_appointment"("end_id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."end_appointment"("end_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."end_appointment"("end_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."end_appointment"("end_id" integer) TO "service_role";


--
-- Name: FUNCTION "get_advertisement"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_advertisement"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_advertisement"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_advertisement"() TO "service_role";


--
-- Name: FUNCTION "get_appointment_by_appointment_id"("id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_appointment_by_appointment_id"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_appointment_by_appointment_id"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_appointment_by_appointment_id"("id" integer) TO "service_role";


--
-- Name: FUNCTION "get_appointment_to_rate"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_appointment_to_rate"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_appointment_to_rate"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_appointment_to_rate"("id" "text") TO "service_role";


--
-- Name: FUNCTION "get_appointments_by_user_id"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id"("id" "text") TO "service_role";


--
-- Name: FUNCTION "get_appointments_by_user_id_which_pending"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id_which_pending"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id_which_pending"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_appointments_by_user_id_which_pending"("id" "text") TO "service_role";


--
-- Name: FUNCTION "get_is_email_exist"("email" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_is_email_exist"("email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_is_email_exist"("email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_is_email_exist"("email" "text") TO "service_role";


--
-- Name: FUNCTION "get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_is_user_reviewed_appointment"("user_id" "text", "appointment_id" bigint) TO "service_role";


--
-- Name: FUNCTION "get_post_by_post_id"("id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_post_by_post_id"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_by_post_id"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_by_post_id"("id" integer) TO "service_role";


--
-- Name: FUNCTION "get_post_with_participants_by_post_id"("id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_post_with_participants_by_post_id"("id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_post_with_participants_by_post_id"("id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_post_with_participants_by_post_id"("id" integer) TO "service_role";


--
-- Name: FUNCTION "get_posts"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_posts"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_posts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posts"() TO "service_role";


--
-- Name: FUNCTION "get_posts_by_user_id"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_posts_by_user_id"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_posts_by_user_id"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posts_by_user_id"("id" "text") TO "service_role";


--
-- Name: FUNCTION "get_posts_with_participants"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_posts_with_participants"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_posts_with_participants"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_posts_with_participants"() TO "service_role";


--
-- Name: FUNCTION "get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_review_by_reviewer_and_appointment_id"("reviewer_id" "text", "appointment_id" integer) TO "service_role";


--
-- Name: FUNCTION "get_reviews_by_reviewee_id"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_reviews_by_reviewee_id"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_reviews_by_reviewee_id"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_reviews_by_reviewee_id"("id" "text") TO "service_role";


--
-- Name: FUNCTION "get_tags"(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_tags"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_tags"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_tags"() TO "service_role";


--
-- Name: FUNCTION "get_user_by_user_id"("id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."get_user_by_user_id"("id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_by_user_id"("id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_by_user_id"("id" "text") TO "service_role";


--
-- Name: FUNCTION "http"("request" "public"."http_request"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "postgres";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "anon";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http"("request" "public"."http_request") TO "service_role";


--
-- Name: FUNCTION "http_delete"("uri" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying) TO "service_role";


--
-- Name: FUNCTION "http_delete"("uri" character varying, "content" character varying, "content_type" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_delete"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";


--
-- Name: FUNCTION "http_get"("uri" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying) TO "service_role";


--
-- Name: FUNCTION "http_get"("uri" character varying, "data" "jsonb"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_get"("uri" character varying, "data" "jsonb") TO "service_role";


--
-- Name: FUNCTION "http_head"("uri" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_head"("uri" character varying) TO "service_role";


--
-- Name: FUNCTION "http_header"("field" character varying, "value" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_header"("field" character varying, "value" character varying) TO "service_role";


--
-- Name: FUNCTION "http_list_curlopt"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_list_curlopt"() TO "service_role";


--
-- Name: FUNCTION "http_patch"("uri" character varying, "content" character varying, "content_type" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_patch"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";


--
-- Name: FUNCTION "http_post"("uri" character varying, "data" "jsonb"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "data" "jsonb") TO "service_role";


--
-- Name: FUNCTION "http_post"("uri" character varying, "content" character varying, "content_type" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_post"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";


--
-- Name: FUNCTION "http_put"("uri" character varying, "content" character varying, "content_type" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_put"("uri" character varying, "content" character varying, "content_type" character varying) TO "service_role";


--
-- Name: FUNCTION "http_reset_curlopt"(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "postgres";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "anon";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_reset_curlopt"() TO "service_role";


--
-- Name: FUNCTION "http_set_curlopt"("curlopt" character varying, "value" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."http_set_curlopt"("curlopt" character varying, "value" character varying) TO "service_role";


--
-- Name: FUNCTION "remove_participant_id_from_post_id"("user_id" "text", "post_id" integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."remove_participant_id_from_post_id"("user_id" "text", "post_id" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."remove_participant_id_from_post_id"("user_id" "text", "post_id" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."remove_participant_id_from_post_id"("user_id" "text", "post_id" integer) TO "service_role";


--
-- Name: FUNCTION "search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_posts_by_condition"("tags" bigint[], "host_name" "text"[], "post_name" "text"[]) TO "service_role";


--
-- Name: FUNCTION "search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_posts_by_conditions"("tag_ids" bigint[], "host_names" "text"[], "post_names" "text"[]) TO "service_role";


--
-- Name: FUNCTION "send_email_message"("message" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."send_email_message"("message" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."send_email_message"("message" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."send_email_message"("message" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_email_message"("message" "jsonb") TO "service_role";


--
-- Name: FUNCTION "send_email_sendinblue"("message" "jsonb"); Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON FUNCTION "public"."send_email_sendinblue"("message" "jsonb") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."send_email_sendinblue"("message" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."send_email_sendinblue"("message" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_email_sendinblue"("message" "jsonb") TO "service_role";


--
-- Name: FUNCTION "update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_accept_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "service_role";


--
-- Name: FUNCTION "update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]) TO "anon";
GRANT ALL ON FUNCTION "public"."update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_post_by_post_id"("id" integer, "title" "text", "location" "text", "tags" integer[], "start_time" timestamp without time zone, "end_time" timestamp without time zone, "description" "text", "images" "text"[]) TO "service_role";


--
-- Name: FUNCTION "update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_reject_appointment_by_appointment_id"("id" integer, "user_id" "text") TO "service_role";


--
-- Name: FUNCTION "update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean) TO "anon";
GRANT ALL ON FUNCTION "public"."update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_review"("id" integer, "description" "text", "score" integer, "is_anonymous" boolean) TO "service_role";


--
-- Name: FUNCTION "update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_by_user_id"("id" "text", "username" "text", "sex" "text", "description" "text", "image" "text") TO "service_role";


--
-- Name: FUNCTION "update_user_national_id_by_user_id"("id" "text", "national_id" "text"); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION "public"."update_user_national_id_by_user_id"("id" "text", "national_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_national_id_by_user_id"("id" "text", "national_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_national_id_by_user_id"("id" "text", "national_id" "text") TO "service_role";


--
-- Name: FUNCTION "urlencode"("string" "bytea"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" "bytea") TO "service_role";


--
-- Name: FUNCTION "urlencode"("data" "jsonb"); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("data" "jsonb") TO "service_role";


--
-- Name: FUNCTION "urlencode"("string" character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "postgres";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."urlencode"("string" character varying) TO "service_role";

--
-- Name: TABLE "advertisement"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."advertisement" TO "anon";
GRANT ALL ON TABLE "public"."advertisement" TO "authenticated";
GRANT ALL ON TABLE "public"."advertisement" TO "service_role";


--
-- Name: SEQUENCE "Advertisement_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."Advertisement_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Advertisement_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Advertisement_id_seq" TO "service_role";


--
-- Name: TABLE "appointment"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."appointment" TO "anon";
GRANT ALL ON TABLE "public"."appointment" TO "authenticated";
GRANT ALL ON TABLE "public"."appointment" TO "service_role";


--
-- Name: SEQUENCE "Appointment_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."Appointment_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Appointment_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Appointment_id_seq" TO "service_role";


--
-- Name: TABLE "post"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."post" TO "anon";
GRANT ALL ON TABLE "public"."post" TO "authenticated";
GRANT ALL ON TABLE "public"."post" TO "service_role";


--
-- Name: SEQUENCE "Post_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Post_id_seq" TO "service_role";


--
-- Name: TABLE "review"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."review" TO "anon";
GRANT ALL ON TABLE "public"."review" TO "authenticated";
GRANT ALL ON TABLE "public"."review" TO "service_role";


--
-- Name: SEQUENCE "review_id_seq"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."review_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."review_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."review_id_seq" TO "service_role";


--
-- Name: TABLE "tag"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."tag" TO "anon";
GRANT ALL ON TABLE "public"."tag" TO "authenticated";
GRANT ALL ON TABLE "public"."tag" TO "service_role";


--
-- Name: SEQUENCE "tag_id_seq1"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE "public"."tag_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."tag_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tag_id_seq1" TO "service_role";


--
-- Name: TABLE "user"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
