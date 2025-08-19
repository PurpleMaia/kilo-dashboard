"use client";
import React from "react";
import { useEffect } from "react";

export default function ChatWidget() {

  // Dynamically inject the Langflow script once on mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Ignoring JSX intrinsic elements by manually rendering the element
  return React.createElement("langflow-chat", {
    window_title: "KILO LLM RAG",
    flow_id: "6a727686-cc9e-4e7f-94a5-2fbd1800fa06",
    host_url: "http://localhost:7860",
    chat_position: 'top-left',    
    height: 650,
    width: 325,
    style: { width: "100%", height: "50%", display: "block" },
  });
}
