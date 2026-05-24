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

export const getNextSequence = async (roomId: string): Promise<void> => {
  await redis.incr(`room:${roomId}:sequence`);
};

export const deleteShapeFromRedis = async (
  roomId: string,
  shapeId: string,
): Promise<void> => {
  await redis.hdel(`room:${roomId}:shapes`, shapeId);
};

// clearTeacherAnnotations
export const clearTeacherAnnotations = async (
  roomId: string,
): Promise<void> => {
  const shapes = await redis.hgetall(`room:${roomId}:shapes`);
  if (!shapes) return;

  const pipeline = redis.pipeline();

  Object.entries(shapes).forEach(([shapeId, shapeData]) => {
    try {
      const shape = JSON.parse(shapeData);
      if (shape.layer === "TEACHER") {
        pipeline.hdel(`room:${roomId}:shapes`, shapeId);
      }
    } catch (error) {
      console.error(
        `Failed to parse shape ${shapeId} during teacher cleanup:`,
        error,
      );
    }
  });
  if (pipeline.length > 0) {
    await pipeline.exec();
  }
};

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

export const subscribeToRoom = async (
  roomId: string,
  callback: (message: object) => void,
): Promise<void> => {
  const channel = `channel:room:${roomId}`;

  await subscriber.subscribe(channel);

  const roomCallbacks = new Map<string, (message: object) => void>();

  subscriber.on("message", (ch, messageStr) => {
    if (ch === channel) {
      try {
        const callback = roomCallbacks.get(ch);
        if (callback) {
          callback(JSON.parse(messageStr));
        }
      } catch (err) {
        console.error(`Failed to parse incoming message on ${channel}:`, err);
      }
    }
  });
};

export const unsubscribeFromRoom = async (roomId: string): Promise<void> => {
  await subscriber.unsubscribe(`channel:room:${roomId}`);
};
