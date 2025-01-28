import { useEffect } from "react";
import gsap from "gsap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// const patient = {
//     name: "John Doe",
//     number: "1234567890",
// }

export default function Profile({patient}) {
  const dispatch = useDispatch();

  useEffect(() => {
    gsap.fromTo(
      ".profile-image",
      { scale: 1 },
      { scale: 1.05, duration: 0.3, ease: "power2.out" }
    );
  }, []);

  const handleImageHover = () => {
    gsap.to(".profile-image", {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleImageLeave = () => {
    gsap.to(".profile-image", { scale: 1, duration: 0.3, ease: "power2.out" });
  };

 
  return (
    <div className="flex flex-col items-center mb-8">
      <div
        className="relative profile-image"
        onMouseEnter={handleImageHover}
        onMouseLeave={handleImageLeave}
      >
        <img
        //   src={patient?.profileImageUrl}
          alt="Patient"
          className="w-32 h-32 rounded-full border-4 border-blue-100 object-cover"
        />
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      <h2 className="mt-4 text-xl font-semibold">{patient?.name || "name"}</h2>
      <p className="text-sm text-gray-500">{patient?.number || "number"}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-sm">
          {/* {displayAvgRating()} */}
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
          {/* Available */}
        </span>
      </div>
    </div>
  );
}
