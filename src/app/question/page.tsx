"use client";

import { useSearchParams, useRouter } from "next/navigation";
import data from "../data.json";
import "../globals.css";
import { useEffect, useState, Suspense, useRef } from "react";
import Image from "next/image";
import IncreaseTime from "../../components/IncreaseTime";
import DecreaseTime from "../../components/DecreaseTime";

interface Question {
  id: number;
  level: string;
  question: string;
  theme: string;
  time: number;
  song?: string | null;
  image?: string | null;
}

function QuestionContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const [question, setQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Mova o useState para o corpo do componente
  const audioRef = useRef<HTMLAudioElement | null>(null); // Mova o useRef para o corpo do componente

  const increaseTime = () => {
    setTimeLeft((prev) => (prev !== null ? prev * 2 : 0));
  };

  const decreaseTime = () => {
    setTimeLeft((prev) => (prev !== null ? Math.floor(prev / 2) : 0));
  };

  useEffect(() => {
    if (id) {
      // Encontra a pergunta correspondente no JSON
      const questionId = data.questions.find((q) => q.id === parseInt(id));
      if (questionId) {
        setQuestion(questionId);
        setTimeLeft(questionId.time); // Inicializa o tempo restante
      }
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null || prevTime <= 0) {
          clearInterval(interval); // Para o intervalo se o tempo for nulo ou zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      // Redireciona para página time-over quando o tempo chegar a zero
      router.push("/time-over");
    }
  }, [timeLeft, router]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause(); // Pausa a música
      } else {
        audioRef.current.play(); // Toca a música
      }
      setIsPlaying(!isPlaying); // Atualiza o estado
    }
  };

  if (!question) {
    return <div>Pergunta não encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        className="absolute top-5 left-5 w-[100px] h-[50px] bg-[#800000] hexagon-button flex justify-center items-center cursor-pointer transition-transform duration-300 ease-in-out hover:scale-125 hover:shadow-xl active:scale-110"
        onClick={() => router.back()}
      ></div>

      <h1 className="text-golden p-6 text-7xl text-center">
        {question.level.toUpperCase()} - {question.theme.toUpperCase()}
      </h1>
      <div className="flex flex-col justify-between h-[700px] bg-beige mx-60 rounded-xl">
        <p className="text-brown font-semibold text-5xl p-14 text-center">
          {question.question}
        </p>
        {question.image === "/enigma1.png" && (
          <div className="flex justify-center">
            <Image
              src={question.image}
              alt="Imagem da pergunta"
              width={175}
              height={300}
            />
          </div>
        )}
        {question.image === "/enigma2.png" && (
          <div className="flex justify-center">
            <Image
              src={question.image}
              alt="Imagem da pergunta"
              width={240}
              height={300}
            />
          </div>
        )}
        {question.image === "/enigma3.png" && (
          <div className="flex justify-center">
            <Image
              src={question.image}
              alt="Imagem da pergunta"
              width={400}
              height={300}
            />
          </div>
        )}
        {/* Renderização condicional para o tema "MÚSICA" */}
        {question.theme.toUpperCase() === "MÚSICA" && (
          <div className="text-brown text-4xl p-14 text-center">
            {/* Aqui você pode adicionar o conteúdo específico para o tema "MÚSICA" */}
            <button
              onClick={togglePlay} // Usa a função togglePlay
              className="mt-4 px-6 py-3 bg-golden text-white rounded-lg hover:bg-yellow-600"
            >
              {isPlaying ? "Pausar Música" : "Tocar Música"}
            </button>
            <audio ref={audioRef} src={question.song || ""} />
          </div>
        )}
        <p className="text-brown text-4xl p-14 text-center">
          TEMPO DE RESPOSTA: {timeLeft !== null ? timeLeft : question.time} SEG
        </p>
      </div>
      {/* Botões para aumentar/diminuir o tempo */}
      <div className="fixed bottom-5 right-5 flex gap-4">
        <DecreaseTime onDecrease={decreaseTime} />
        <IncreaseTime onIncrease={increaseTime} />
      </div>
    </div>
  );
}

export default function Question() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuestionContent />
    </Suspense>
  );
}
