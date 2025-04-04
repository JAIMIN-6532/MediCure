import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import io from "socket.io-client";

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
import { updateAvailableSlots } from "../../reduxToolkit/reducers/BookingReducer.js";

let socket;
//semple
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
  const [form, setForm] = useState({});

  const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector(
    (state) => state.doctors
  );
  const user = useSelector((state) => state.auth.user);
  const { appointments, status, errorA } = useSelector(
    (state) => state.appointments
  );

  const { bookappointmentStatus, bookappointmentError } = useSelector(
    (state) => state.appointments
  );

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [prevDoctorId, setPrevDoctorId] = useState(null);
  useEffect(() => {
    socket = io.connect(`${import.meta.env.VITE_APP_API_URL}`, {
      transports: ["websocket", "polling"],
    });
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
    window.scrollTo(0, 0);
  }, [step]);
  const handleNext = async (e) => {
    e.preventDefault();
    socket.emit("lockSlot", {
      doctorId: doctorId,
      date: selectedDate,
      timeSlot: selectedSlot,
      patientId: user._id,
    });

    setStep(step + 1);
  };

  useEffect(() => {
    socket = io(`${import.meta.env.VITE_APP_API_URL}`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      // console.log("Socket connected:", socket.id);
    });

    socket.on("slotLocked", (lockedSlot) => {
      // console.log("Slot locked successfully: ", lockedSlot);
      // console.log("appointments after locking SLots", appointments);
      const lockedDate = new Date(lockedSlot.date).toISOString().split("T")[0];

      if (appointments && Array.isArray(appointments.availableSlots)) {
        const updatedAppointments = {
          ...appointments,
          availableSlots: appointments.availableSlots.map((slotGroup) => {
            const slotGroupDate = new Date(slotGroup.date)
              .toISOString()
              .split("T")[0];

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
        // console.log(
        //   "Updated Appointments after locking slot:",
        //   updatedAppointments
        // );
        dispatch(updateAvailableSlots(updatedAppointments));

        // console.log(updatedAppointments);
      }
      //  else {
      //   console.error(
      //     "appointments is not structured as expected:",
      //     appointments
      //   );
      // }
    });

    socket.on("slotUnlocked", (unlockedSlot) => {
      // console.log("Slot unlocked successfully: ", unlockedSlot);

      const unlockedDate = new Date(unlockedSlot.date)
        ?.toISOString()
        ?.split("T")[0];

      if (appointments && Array.isArray(appointments.availableSlots)) {
        const updatedAppointments = {
          ...appointments,
          availableSlots: appointments.availableSlots.map((slotGroup) => {
            const slotGroupDate = new Date(slotGroup.date)
              ?.toISOString()
              ?.split("T")[0];

            if (slotGroupDate === unlockedDate) {
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
      } 
      // else {
      //   // console.error(
      //   //   "appointments is not structured as expected:",
      //   //   appointments
      //   );
      // }
      setStep(1);
    });

    socket.on("appointmentBooked", (appointment) => {
      // console.log("Appointment booked successfully: ", appointment);
      setStep(3);
    });

    return () => {
      socket.off("connect");
      socket.off("slotLocked");
      socket.off("appointmentBooked");
    };
  }, [dispatch, doctorId, appointments]);

  const handleBookingConfirm = async (formData) => {
    setForm(formData);
    if (formData.paymentMethod === "Online") {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/payment/create-order`,
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
              // console.log(response);
              const orderId = response.razorpay_order_id;
              const isPaymentCaptured = await axios.post(
                `${import.meta.env.VITE_APP_API_URL}/api/payment/verify`,
                {
                  orderId,
                }
              );
              // console.log(isPaymentCaptured);
              if (isPaymentCaptured.data.success) {
                dispatch(
                  bookAppointment({
                    doctorId: formData.doctorId,
                    patientId: formData.patientId,
                    paymentId: orderId,
                    paymentType: "Online",
                    appointmentFees: selectedDoctor.consultationFee,
                    date: formData.selectedDate,
                    timeSlot: formData.selectedSlot,
                    type: formData.serviceType,
                  })
                );
              } else {
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
        // console.log(error);
      }
    } else {
      dispatch(
        bookAppointment({
          doctorId: formData.doctorId,
          patientId: formData.patientId,
          appointmentFees: selectedDoctor.consultationFee,
          paymentType: "Offline",
          date: formData.selectedDate,
          timeSlot: formData.selectedSlot,
          type: formData.serviceType,
        })
      );
    }
  };

  useEffect(() => {
    if (bookappointmentStatus === "succeeded" && doctorId === prevDoctorId) {
      setStep(3);
    }
  }, [bookappointmentStatus, doctorId, dispatch]);

  const handleViewInvoice = () => {
    setStep(4);
  };

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
            form={form}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
