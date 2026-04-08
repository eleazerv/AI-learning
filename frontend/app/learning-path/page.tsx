import Header from "@/components/layout/header";
export default function LearningPath() {
  const path = [
    {
      judul: "matematika",
    },
    {
      judul: "fisika",
    },
    {
      judul: "biologi",
    },
  ];
  return (
    <>
      <Header>
        <div className="mx-8 my-8 flex gap-4">
          {path.map((res) => (
            <div key={res.judul} className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center flex border-2 border-gray-300">
              <p className="break-words text-center w-full">{res.judul}</p>
            </div>
          ))}
        </div>
      </Header>
    </>
  );
}
