import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

let cached = (global as any).mongoose;

if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };



export async function connectDB() {
  let isConnected = false;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  isConnected = true;
  
  if (isConnected === true){
    console.log("✅ MongoDB connected");

  }
  cached.conn = await cached.promise;
  return cached.conn;
}
