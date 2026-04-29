export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { connectDB } = await import("./lib/mongodb");
    try {
      await connectDB();
    } catch (error) {
      console.error("Failed to connect to MongoDB during startup:", error);
      console.warn("The app will attempt to reconnect when database access is needed.");
    }
  }
}
