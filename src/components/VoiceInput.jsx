import { useState, useEffect, useRef } from "react";
import { Mic } from "lucide-react";

/**
 * VoiceInput — a mic button that uses the browser-native SpeechRecognition API
 * to transcribe speech into a text/textarea field.
 *
 * Renders nothing on browsers without SpeechRecognition support (e.g. Firefox).
 * Speech is appended to whatever was already in the field, so keyboard input
 * and dictation can be mixed freely.
 *
 * Props:
 *   value     — current value of the input field (string)
 *   onChange  — called with the new value (string) when speech is transcribed
 *   disabled  — optional, disables the mic button
 *   className — optional extra classes for positioning
 */
export default function VoiceInput({
  value,
  onChange,
  disabled = false,
  className = "",
}) {
  // Feature-detect once. If unsupported, the component renders null below.
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  // Snapshot of `value` at the moment recording started, so onresult appends
  // to a stable baseline instead of stale closure state.
  const baseValueRef = useRef("");
  // Latest onChange — keeps the recognition handlers from going stale.
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Cleanup: if the component unmounts mid-recording, stop the mic.
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore — already stopped
        }
      }
    };
  }, []);

  if (!SpeechRecognition) {
    return null;
  }

  const startRecording = () => {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    baseValueRef.current = value || "";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Persist finalized transcript into the baseline so the next event
      // doesn't overwrite it with only interim results.
      if (finalTranscript) {
        const sep =
          baseValueRef.current && !baseValueRef.current.endsWith(" ")
            ? " "
            : "";
        baseValueRef.current =
          baseValueRef.current + sep + finalTranscript.trim();
      }

      const sep =
        baseValueRef.current &&
        interimTranscript &&
        !baseValueRef.current.endsWith(" ")
          ? " "
          : "";
      onChangeRef.current(baseValueRef.current + sep + interimTranscript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsRecording(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch {
      // start() throws if called while already running — safe to ignore.
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsRecording(false);
  };

  const handleClick = (e) => {
    // Prevent button from submitting forms or stealing focus from the input.
    e.preventDefault();
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={isRecording ? "Stop recording" : "Start voice input"}
      aria-label={isRecording ? "Stop voice input" : "Start voice input"}
      className={`absolute z-10 flex items-center justify-center w-7 h-7 rounded-md transition-colors
        ${
          isRecording
            ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
            : "text-gray-400 hover:text-accent hover:bg-accent/10 dark:text-text-muted"
        }
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}`}
    >
      {isRecording && (
        <span className="absolute inline-flex h-full w-full rounded-md bg-red-500/30 animate-ping" />
      )}
      <Mic size={14} className="relative" />
    </button>
  );
}
