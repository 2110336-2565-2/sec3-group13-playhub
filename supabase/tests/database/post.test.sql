begin;
select plan( 2 );

-- test add_participant_id_to_post_id
insert into post (owner_id) values ('testuser1-id');

with test_post as (select * from post where owner_id = 'testuser1-id')
select ok('testuser2-id' not in (select unnest(participants) from test_post));
with test_post as (select * from post where owner_id = 'testuser1-id')
select add_participant_id_to_post_id('testuser2-id'::text, (select id from test_post)::integer);
with test_post as (select * from post where owner_id = 'testuser1-id')
select ok('testuser2-id' in (select unnest(participants) from test_post));

select * from finish();
rollback;