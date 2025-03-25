import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PaymentCompleted = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);

  const goToHome = () => {
    setTimeout(() => {
      if (timer > 0) {
        goToHome();
        setTimer(timer - 1);
      } else {
        navigate("/checkout");
      }
    }, 1000);
  };
  useEffect(() => {
    goToHome();
  });

  return (
    <div className="text-center w-full my-[100px] max-[1199px]:mt-[35px]">
      <img
        src="../assets/img/logo/payment-cancelled.svg"
        alt="payment-cancelled"
        className="mx-auto mb-10"
        width={150}
      />
      <div className="mb-[30px] max-[991px]:hidden">
        <h3 className="font-quicksand mt-3 text-[70px] text-[#575757] opacity-[0.75] font-bold leading-[1.2] tracking-[0.03rem] max-[1399px]:text-[95px] max-[1199px]:text-[70px] max-[767px]:text-[42px]">
          Payment Cancelled
        </h3>

        <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem] mt-3">
          You will be redirected to the{" "}
          <Link to="/checkout" className="font-semibold text-blue-700">
            Checkout
          </Link>{" "}
          in {timer} seconds. If not, please click on the Home page.
        </p>
      </div>
    </div>
  );
};

export default PaymentCompleted;
