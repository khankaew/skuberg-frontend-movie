import { Button } from "primereact/button";
import type { Movie } from "../interfaces";
import { Divider } from "primereact/divider";

interface PropType {
  movieList: Movie[];
  handleAddToBasket: (movie: Movie) => void;
}

function MovieCard(prop: PropType) {
  const { movieList, handleAddToBasket } = prop;

  return (
    <>
      <p className="text-lg font-bold">รายการภาพยนต์</p>
      <Divider />
      <div className="grid grid-cols-4 gap-4">
        {movieList.length === 0 && (
          <div className="col-span-4">
            <p>ไม่พบข้อมูล</p>
          </div>
        )}

        {movieList.map((movie) => (
          <div
            key={movie.id}
            className="rounded-md shadow-lg flex flex-col justify-between"
          >
            <div>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt={movie.title}
                className="rounded-t-lg"
              />
              <p className="p-2 text-md text-gray-700">{movie.title}</p>
            </div>
            <div className="p-2 flex justify-between">
              <div className="text-purple-500">{movie.price} บาท</div>
              <Button
                label="+"
                rounded
                size="small"
                tooltip="เพิ่มใส่ตะกร้า"
                onClick={() => handleAddToBasket(movie)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MovieCard;
