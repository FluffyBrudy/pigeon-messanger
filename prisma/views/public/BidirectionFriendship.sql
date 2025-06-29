SELECT
  "AcceptedFriendship"."userId1" AS "userId",
  "AcceptedFriendship"."userId2" AS "friendId"
FROM
  "AcceptedFriendship"
UNION
SELECT
  "AcceptedFriendship"."userId2" AS "userId",
  "AcceptedFriendship"."userId1" AS "friendId"
FROM
  "AcceptedFriendship";