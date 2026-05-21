import Redis from "ioredis";

export const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);
export const publisher = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);
export const subscriber = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export const saveShapeToRedis = async (
  roomId: string,
  shapeId: string,
  shape: object,
): Promise<void> => {
  await redis.hset(`room:${roomId}:shapes`, shapeId, JSON.stringify(shape));
  await redis.expire(`room:${roomId}:shapes`, 60 * 60 * 24);
};

export const getShapesFromRedis = async (roomId: string): Promise<object[]> => {
  const shapes = await redis.hgetall(`room:${roomId}:shapes`);
  if (!shapes) return [];
  return Object.values(shapes).map((s) => JSON.parse(s));
};

export const deleteShapeFromRedis = async (
  roomId: string,
  shapeId: string,
): Promise<void> => {
  await redis.hdel(`room:${roomId}:shapes`, shapeId);
};

// add clearTeacherAnnotations

export const addUserToRoom = async (
  roomId: string,
  userId: string,
  userData: object,
): Promise<void> => {
  await redis.hset(`room:${roomId}:users`, userId, JSON.stringify(userData));
};

export const removeUserFromRoom = async (
  roomId: string,
  userId: string,
): Promise<void> => {
  await redis.hdel(`room:${roomId}:users`, userId);
};

export const getRoomUsers = async (roomId: string): Promise<object[]> => {
  const users = await redis.hgetall(`room:${roomId}:users`);
  if (!users) return [];
  return Object.values(users).map((u) => JSON.parse(u));
};

export const setRoomLocked = async (
  roomId: string,
  isLocked: boolean,
): Promise<void> => {
  await redis.set(`room:${roomId}:locked`, isLocked ? "1" : "0");
};

export const isRoomLocked = async (roomId: string): Promise<boolean> => {
  const val = await redis.get(`room:${roomId}:locked`);
  return val === "1";
};

export const publishToRoom = async (
  roomId: string,
  message: object,
): Promise<void> => {
  await publisher.publish(`channel:room:${roomId}`, JSON.stringify(message));
};

//adding subscribeToRoom callback
//
//
//

export const unsubscribeFromRoom = async (roomId: string): Promise<void> => {
  await subscriber.unsubscribe(`channel:room:${roomId}`);
};
