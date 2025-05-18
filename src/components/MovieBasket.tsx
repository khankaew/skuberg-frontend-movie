import { Divider } from "primereact/divider";
import type { Movie } from "../interfaces";

interface PropType {
  baskets: Movie[];
}

function MovieBasket(prop: PropType) {
  const { baskets } = prop;
  return (
    <>
      {baskets.map((basket) => (
        <div key={basket.id}>
          <div className="grid grid-cols-4 gap-4">
            <img
              src={`https://image.tmdb.org/t/p/w500/${basket.poster_path}`}
              alt={basket.title}
              className="rounded-lg"
            />
            <div className="col-span-3">
              <p className="p-2 text-md text-gray-700">{basket.title}</p>
              <div className="p-2 text-purple-500">{basket.price} บาท</div>
            </div>
          </div>
          <Divider />
        </div>
      ))}
    </>
  );
}

export default MovieBasket;
