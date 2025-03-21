"use client";
import { Button } from "@heroui/react";
import React, { useCallback, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CallPage() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = getSocket();
  const router = useRouter();
  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, []);

  async function makeCall(e: React.FormEvent) {
    e.preventDefault();
    socket.emit("room:join", { email, room });
  }
  const handleJoinRoom = useCallback((data) => {
    const { email, room } = data;
    router.push(`/room/${room}`);
  }, []);
  return (
    <main>
      <h1>This is the page for Inititating the call</h1>
      <form onSubmit={makeCall}>
        <div>
          <label htmlFor="email">Enter Email</label>
          <input
            className="border-black bg-yellow-50 text-blue-950"
            id="email"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="room">Enter Room ID</label>
          <input
            className="border-black bg-yellow-50 text-blue-950"
            id="room"
            type="text"
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>
        <Button color="secondary" type="submit">
          Inititate Call
        </Button>
      </form>
    </main>
  );
}

export default CallPage;
