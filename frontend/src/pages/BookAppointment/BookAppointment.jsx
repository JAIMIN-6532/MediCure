import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer.js";
import {
  fetchAppointmentSlots,
  bookAppointment,
} from "../../reduxToolkit/reducers/BookingReducer.js";
import DoctorInfo from "../../components/BookAppointment/DoctorInfo";
import SlotSelection from "../../components/BookAppointment/SlotSelection";
import PersonalInfo from "../../components/BookAppointment/PersonalInfo";
import BookingConfirmation from "../../components/BookAppointment/BookingConfirmation";
import Invoice from "../../components/BookAppointment/Invoice";
import { lockSlot } from "../../reduxToolkit/reducers/BookingReducer.js";
import io from "socket.io-client";
import { ClipLoader } from "react-spinners";
import { updateAvailableSlots } from "../../reduxToolkit/reducers/BookingReducer.js";
import axios from "axios";
// import ScrollToTop from "../../components/ScrolltoTop.jsx";

let socket;

const mockInvoice = {
  orderId: "00124",
  issueDate: "20/07/2023",
  doctor: {
    name: "Dr. Darren Elder",
    address: "806 Twin Willow Lane, Old Forge",
    location: "Newyork, USA",
  },
  patient: {
    name: "Walter Roberson",
    address: "299 Star Trek Drive, Panama City",
    location: "Florida, 32405, USA",
  },
  payment: {
    method: "Debit Card",
    cardNumber: "XXXXXXXXXXXX-2541",
    bank: "HDFC Bank",
  },
  items: [
    {
      description: "General Consultation",
      quantity: 1,
      vat: 0,
      total: 100,
    },
    {
      description: "Video Call Booking",
      quantity: 1,
      vat: 0,
      total: 250,
    },
  ],
  subtotal: 350,
  discount: 10,
  total: 315,
};

const BookAppointment = () => {
  const { doctorId } = useParams();
  const dispatch = useDispatch();

  const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector(
    (state) => state.doctors
  );
  const user = useSelector((state) => state.auth.user);
  const { appointments, status, errorA } = useSelector(
    (state) => state.appointments
  );

  console.log("appointments from state", appointments);

  const { bookappointmentStatus, bookappointmentError } = useSelector(
    (state) => state.appointments
  );

  // const [uappointments, setuAppointments] = useState(null);

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [prevDoctorId, setPrevDoctorId] = useState(null);
  useEffect(() => {
    socket = io.connect("https://medicure-go5v.onrender.com", {
      transports: ["websocket", "polling"],
    });
    // return () => {

    //   socket.disconnect();
    // };
  }, []);

  useEffect(() => {
    if (doctorId !== prevDoctorId) {
      setPrevDoctorId(doctorId);
      setStep(1);
      setSelectedDate(new Date());
      setSelectedSlot(null);

      dispatch(fetchDoctorById(doctorId));
      dispatch(fetchAppointmentSlots(doctorId));
    }
  }, [doctorId, dispatch, prevDoctorId]);

  useEffect(() => {
    // Scroll to top whenever the step changes
    window.scrollTo(0, 0);
  }, [step]); // This will trigger whenever `step` changes

  const handleNext = async (e) => {
    e.preventDefault();
    // dispatch(
    //     lockSlot({
    //       doctorId: doctorId,
    //       date: selectedDate,
    //       timeSlot: selectedSlot,
    //       patientId: user._id,
    //     })
    //   );
    socket.emit("lockSlot", {
      doctorId: doctorId,
      date: selectedDate,
      timeSlot: selectedSlot,
      patientId: user._id,
    });

    setStep(step + 1);
  };

  // Initialize socket and listen for updates
  useEffect(() => {
    socket = io(`${import.meta.env.VITE_APP_API_URL}`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Listen for 'slotLocked' event to update slots
    socket.on("slotLocked", (lockedSlot) => {
      console.log("Slot locked successfully: ", lockedSlot);
      localStorage.setItem("lockedslotid", lockedSlot._id);
      // Update available slots after slot is locked
      // Dispatch an action to update available slots
      //  dispatch(updateAvailableSlots(lockedSlot));
      // if (Array.isArray(appointments)) {
      //   const updatedSlots = appointments.filter((slot) => slot !== lockedSlot.timeSlot);
      //   dispatch(setAvailableSlots(updatedSlots));
      // }

      // console.log("lockedSlot", lockedSlot);
      console.log("appointments after locking SLots", appointments);
      // Sample lockedSlot with ISO 8601 date format

      // Sample appointments array with one object

      // // Convert the lockedSlot's date to just the date part (YYYY-MM-DD)
      const lockedDate = new Date(lockedSlot.date).toISOString().split("T")[0];

      // Check if appointments is an object with availableSlots array
      if (appointments && Array.isArray(appointments.availableSlots)) {
        // Remove lockedSlot from appointments
        const updatedAppointments = {
          ...appointments,
          availableSlots: appointments.availableSlots.map((slotGroup) => {
            const slotGroupDate = new Date(slotGroup.date)
              .toISOString()
              .split("T")[0];

            // If the date matches, remove the locked timeSlot
            if (slotGroupDate === lockedDate) {
              const updatedSlots = slotGroup.availableSlots.filter(
                (slot) => slot !== lockedSlot.timeSlot
              );
              return {
                ...slotGroup,
                availableSlots: updatedSlots,
              };
            }
            return slotGroup;
          }),
        };
        console.log(
          "Updated Appointments after locking slot:",
          updatedAppointments
        );
        dispatch(updateAvailableSlots(updatedAppointments));

        console.log(updatedAppointments);
      } else {
        console.error(
          "appointments is not structured as expected:",
          appointments
        );
      }
      // dispatch(fetchAppointmentSlots(doctorId)); // Fetch updated slots after slot is locked
      // appointments.availableSlots = appointments.availableSlots.filter(
      //   (slot) => slot !== lockedSlot.timeSlot
      // );
      // dispatch(updateAvailableSlots(lockedSlot));
    });

    // socket.on("slotUnlocked", (unlockedSlot) => {
    //   console.log("Slot unlocked successfully: ", unlockedSlot);
    //   // Convert unlockedSlot date to YYYY-MM-DD format
    //   const unlockedDate = new Date(unlockedSlot.date)
    //     .toISOString()
    //     .split("T")[0];

    //   if (appointments && Array.isArray(appointments.availableSlots)) {
    //     // Update the appointments object directly to add the unlocked time slot
    //     const updatedAppointments = {
    //       ...appointments,
    //       availableSlots: appointments.availableSlots.map((slotGroup) => {
    //         const slotGroupDate = new Date(slotGroup.date)
    //           .toISOString()
    //           .split("T")[0];

    //         // If the date matches, add the unlocked timeSlot back to the available slots
    //         if (slotGroupDate === unlockedDate) {
    //           return {
    //             ...slotGroup,
    //             availableSlots: [
    //               ...slotGroup.availableSlots,
    //               unlockedSlot.timeSlot,
    //             ], // Add unlocked time slot
    //           };
    //         }
    //         return slotGroup;
    //       }),
    //     };
    //     console.log("Updated Appointments after unlocking slot:", updatedAppointments);
    //     // Directly update the appointments object in Redux
    //     dispatch(updateAvailableSlots(updatedAppointments));

    //     console.log(
    //       "Updated Appointments after unlocking slot after setAvalable:",
    //       updatedAppointments
    //     );
    //   } else {
    //     console.error(
    //       "appointments is not structured as expected:",
    //       appointments
    //     );
    //   }
    //   // if(step >= 2)
    //   setStep(1); // Reset to slot selection step
    //   // dispatch(fetchAppointmentSlots(doctorId)); // Fetch updated slots after slot is unlocked
    // });
    socket.on("slotUnlocked", (unlockedSlot) => {
      console.log("Slot unlocked successfully: ", unlockedSlot);
      if(localStorage.getItem("lockedslotid")){
        localStorage.removeItem("lockedslotid");
      }
      const unlockedDate = new Date(unlockedSlot.date)
        .toISOString()
        .split("T")[0];

      if (appointments && Array.isArray(appointments.availableSlots)) {
        const updatedAppointments = {
          ...appointments,
          availableSlots: appointments.availableSlots.map((slotGroup) => {
            const slotGroupDate = new Date(slotGroup.date)
              .toISOString()
              .split("T")[0];

            // If the date matches, add the unlocked timeSlot back to the available slots
            if (slotGroupDate === unlockedDate) {
              // Check if the timeSlot is already in availableSlots to avoid duplicates
              const updatedSlots = slotGroup.availableSlots.includes(
                unlockedSlot.timeSlot
              )
                ? slotGroup.availableSlots
                : [...slotGroup.availableSlots, unlockedSlot.timeSlot];

              return {
                ...slotGroup,
                availableSlots: updatedSlots,
              };
            }
            return slotGroup;
          }),
        };

        dispatch(updateAvailableSlots(updatedAppointments));
      } else {
        console.error(
          "appointments is not structured as expected:",
          appointments
        );
      }
      setStep(1); // Reset to slot selection step
    });

    // Listen for 'appointmentBooked' event to confirm booking
    socket.on("appointmentBooked", (appointment) => {
      console.log("Appointment booked successfully: ", appointment);
      setStep(3); // Proceed to booking confirmation step
    });

    return () => {
      socket.off("connect");
      socket.off("slotLocked");
      socket.off("appointmentBooked");
    };
  }, [dispatch, doctorId, appointments]);

  const handleBookingConfirm = async (formData) => {
    if (formData.serviceType === "Online") {
      try {
        const response = await axios.post(
          "https://medicure-go5v.onrender.com/api/payment/create-order",
          {
            doctor: formData.doctorId,
            amount: selectedDoctor.consultationFee,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage?.getItem("token")}`,
            },
          }
        );

        const order = response.data;
        if (order) {
          const options = {
            key: order.key,
            amount: order.amount,
            currency: "INR",
            name: "Doctor Consultation",
            description: "Consultation with Doctor",
            order_id: order.orderId,
            handler: async function (response) {
              console.log(response);
              const orderId = response.data.orderId;
              const isPaymentCaptured = await axios.post(
                "https://medicure-go5v.onrender.com/api/payment/verify",{
                  orderId,
                }
              )
              console.log(isPaymentCaptured);
              if(isPaymentCaptured.data.success){
              dispatch(
                bookAppointment({
                  doctorId: formData.doctorId,
                  patientId: formData.patientId,
                  date: formData.selectedDate,
                  timeSlot: formData.selectedSlot,
                  type: formData.serviceType,
                })
              );
            }else{
              console.log("Payment not captured");
              setStep(1);
            }
            },
            prefill: {
              name: formData.firstName,
              email: formData.email,
              contact: formData.phone,
            },
            notes: {
              appointmenttype: formData.serviceType,
            },
          };
          const rezorpayInstance = new window.Razorpay(options);
          rezorpayInstance.open();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch(
        bookAppointment({
          doctorId: formData.doctorId,
          patientId: formData.patientId,
          date: formData.selectedDate,
          timeSlot: formData.selectedSlot,
          type: formData.serviceType,
        })
      );
    }

    // socket.emit("bookAppointment", {
    //   doctorId: formData.doctorId,
    //   patientId: formData.patientId,
    //   date: formData.selectedDate,
    //   timeSlot: formData.selectedSlot,
    //   type: formData.serviceType,
    // });
  };

  // Handle successful booking confirmation
  useEffect(() => {
    if (bookappointmentStatus === "succeeded" && doctorId === prevDoctorId) {
      setStep(3); // Move to the confirmation step
    }
  }, [bookappointmentStatus, doctorId, dispatch]);

  const handleViewInvoice = () => {
    setStep(4);
  };

  // if (fetchDoctorByIdStatus === "loading" || status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // Conditional render for loading spinner
  const isLoading = fetchDoctorByIdStatus === "loading" || status === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <ClipLoader size={50} color="#3498db" />
      </div>
    );
  }

  if (fetchDoctorByIdStatus === "failed" || status === "failed") {
    return <div>Error: {error || errorA}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="max-w-6xl mx-auto pt-16">
        <DoctorInfo doctor={selectedDoctor} />

        {step === 1 && (
          <SlotSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            doctor={selectedDoctor}
            appointmentSlots={appointments?.availableSlots}
            setSelectedSlot={setSelectedSlot}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <PersonalInfo
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            patient={user}
            onSubmit={handleBookingConfirm}
            doctor={selectedDoctor}
          />
        )}

        {step === 3 && (
          <BookingConfirmation
            booking={{
              doctorName: selectedDoctor.name,
              date: selectedDate.toLocaleDateString(),
              time: selectedSlot,
              city: selectedDoctor.city || selectedDoctor.clinicaddress,
            }}
            patient={user}
            onViewInvoice={handleViewInvoice}
          />
        )}

        {step === 4 && (
          <Invoice
            invoice={mockInvoice}
            doctor={selectedDoctor}
            patient={user}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
