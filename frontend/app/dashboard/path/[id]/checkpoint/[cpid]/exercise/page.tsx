"use client";

import { useCheckpointStore } from "@/stores/checkpoint-store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Exercise() {
  interface Exercise {
    id: string;
    question: string;
    options: string[];
    explanation: string;
    correctAnswer: string;
    difficulty: string;
    orderIndex: number;
  }

  const router = useRouter();
  const params = useParams();
  const cpid = params.cpid as string;
  const id = params.id as string;

  const { fetchCheckpoint, current, submit, submitLoading} = useCheckpointStore();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (cpid) {
      fetchCheckpoint(cpid);
    }
  }, [cpid, fetchCheckpoint]);

  useEffect(() => {
    if (current?.exercises) {
      setExercises(current.exercises);
      setCurrentIndex(0);
      setAnswers({});
    }
  }, [current]);

  const sortedExercises = [...exercises].sort(
    (a, b) => a.orderIndex - b.orderIndex,
  );

  const currentExercise = sortedExercises[currentIndex];

  const handleSelect = (option: string) => {
    const exerciseId = currentExercise.id;

    setAnswers((prev) => ({
      ...prev,
      [exerciseId]: option,
    }));
  };

  const next = () => {
    if (currentIndex < sortedExercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

   const handleSubmit = async () => {
    const payload = Object.entries(answers).map(
      ([exerciseId, answer]) => ({
        exerciseId,
        answer: answer.split(".")[0],
      })
    );

    try {
      const result = await submit(cpid, payload);
      console.log("submit result: ", result);

      router.push(`http://localhost:4000/dashboard/path/${id}/`);
    } catch (err) {
      console.error("submit error:", err);
    }
  };

  if (!currentExercise) {
    return <div className="p-6">Loading...</div>;
  }

  const selectedOption = answers[currentExercise.id];

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>
            Soal {currentIndex + 1} / {sortedExercises.length}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <h2 className="text-lg font-semibold">{currentExercise.question}</h2>

          <div className="space-y-2">
            {currentExercise.options.map((opt, i) => {
              const isSelected = selectedOption === opt;

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(opt)}
                  className={`
                    border rounded-md p-3 cursor-pointer transition
                    ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : ""
                    }
                  `}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prev}
              disabled={currentIndex === 0}
            >
              Prev
            </Button>

            {currentIndex < sortedExercises.length - 1 ? (
              <Button onClick={next}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
