begin;
select plan( 1 );

-- test create_appointment
insert into post (owner_id) values ('testuser1-id');
with test_post as (select * from post where owner_id = 'testuser1-id')
select create_appointment(
  (select id from test_post)::integer,
  (select title from test_post),
  (select location from test_post),
  (select description from test_post),
  (select tags from test_post)::integer[],
  (select start_time from test_post)::timestamp without time zone,
  (select end_time from test_post)::timestamp without time zone,
  (select images from test_post),
  (select participants from test_post),
  (select owner_id from test_post)
);
select pass();

select * from finish();
rollback;