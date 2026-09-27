CREATE OR REPLACE VIEW vw_feedback_details
WITH (security_invoker = on)
AS
SELECT
  f.id,
  f.created_at,
  f.user_id,
  f.title,
  f.description,
  f.category,
  f.status,
  f.is_deleted,
  f.deleted_by_admin,
  f.deleted_at,
  json_build_object(
    'full_name', p.full_name,
    'avatar_url', p.avatar_url
  ) as profile,
  (SELECT count(*) FROM comment c WHERE c.feedback_id = f.id) as comment_count,
  (SELECT count(*) FROM votes v WHERE v.feedback_id = f.id) as upvote_count
FROM feedback f
LEFT JOIN profile p ON f.user_id = p.id;