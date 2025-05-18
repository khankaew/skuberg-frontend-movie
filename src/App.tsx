import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { Dialog } from "primereact/dialog";
import type { Movie } from "./interfaces";
import MovieCard from "./components/MovieCard";
import MovieBasket from "./components/MovieBasket";

const KEY = "800b95d2918dd63d4071429812512387";

function App() {
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [baskets, setBaskets] = useState<Movie[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<string>("0%");
  const [pricePay, setPricePay] = useState<number>(0);

  const [visible, setVisible] = useState<boolean>(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (firstLoad) {
      const baskets = localStorage.getItem("baskets");
      if (baskets) {
        setBaskets(JSON.parse(baskets));
        calculatePrice();
      }
      setFirstLoad(false);
    } else {
      localStorage.setItem("baskets", JSON.stringify(baskets));
      calculatePrice();
    }
  }, [baskets]);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${searchValue}`
      );
      const data = await response.json();
      const setPrice = data.results.map((movie: Movie) => {
        return {
          ...movie,
          price: 100,
        };
      });
      setMovieList(setPrice);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToBasket = (movie: Movie) => {
    const findMovie = baskets.find((item) => item.id === movie.id);
    if (!findMovie) {
      setBaskets([...baskets, movie]);
    }
  };

  const calculatePrice = () => {
    const total = baskets.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);

    const countBasket = baskets.length;
    if (countBasket > 5) {
      // ลด 20%
      const discountPrice = (total * 20) / 100;
      setDiscount(discountPrice);
      setDiscountPercent("20%");
      setPricePay(total - discountPrice);
    } else if (countBasket > 3) {
      // ลด 10%
      const discountPrice = (total * 10) / 100;
      setDiscount(discountPrice);
      setDiscountPercent("10%");
      setPricePay(total - discountPrice);
    } else {
      setDiscount(0);
      setDiscountPercent("0%");
      setPricePay(total);
    }
  };

  const handleClear = () => {
    setBaskets([]);
  };

  const handlePay = () => {
    if (baskets.length > 0) {
      setVisible(true);
      setSeconds(60);
    }
  };

  return (
    <>
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            aria-label="Global"
            className="flex items-center justify-between p-6 lg:px-8"
          >
            <div className="flex lg:flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-balance text-gray-900">
                Movie
              </h1>
            </div>
            <div className="lg:flex lg:gap-x-6">
              <InputText
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="ค้นหาชื่อภาพยนต์..."
                className="!rounded-2xl min-w-[400px]"
              />
              <Button label="ค้นหา" rounded onClick={handleSearch} />
            </div>
            <div className="lg:flex lg:flex-1 lg:justify-end"></div>
          </nav>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
            />
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 ">
                <MovieCard
                  movieList={movieList}
                  handleAddToBasket={handleAddToBasket}
                />
              </div>
              <div>
                <Fieldset legend="ตะกร้าสินค้า">
                  <MovieBasket baskets={baskets} />

                  <div className="flex justify-between">
                    <div className="text-md ">จำนวน </div>
                    <div className="text-md ">{baskets.length} รายการ</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-md ">ราคารวม </div>
                    <div className="text-md ">{totalPrice} บาท</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-md ">ส่วนลด ({discountPercent}) </div>
                    <div className="text-md ">{discount} บาท</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-md font-bold">ราคาที่ต้องชำระ </div>
                    <div className="text-md font-bold">{pricePay} บาท</div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      label="Clear"
                      severity="warning"
                      rounded
                      disabled={baskets.length === 0}
                      onClick={handleClear}
                    />
                    <Button
                      label="ชำระเงิน"
                      severity="info"
                      rounded
                      disabled={baskets.length === 0}
                      onClick={handlePay}
                    />
                  </div>
                </Fieldset>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-288.75"
            />
          </div>

          <Dialog
            header="ชำระเงิน"
            visible={visible}
            style={{ width: "30vw" }}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
              setSeconds(0);
            }}
          >
            <p className="m-0">โอนเงินไปที่บัญชีธนาคาร 123-456-789-0</p>
            <p>ยอดชำระเงิน {pricePay} บาท</p>
            <p>
              ภายในระยะเวลา{" "}
              <span className="font-bold text-2xl">{seconds} </span> วินาที
            </p>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default App;
