import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDoctorById } from "../../reduxToolkit/reducers/DoctorReducer.js";
import { fetchAppointmentSlots, bookAppointment } from "../../reduxToolkit/reducers/BookingReducer.js";
import DoctorInfo from "../../components/BookAppointment/DoctorInfo";
import SlotSelection from "../../components/BookAppointment/SlotSelection";
import PersonalInfo from "../../components/BookAppointment/PersonalInfo";
import BookingConfirmation from "../../components/BookAppointment/BookingConfirmation";
import Invoice from "../../components/BookAppointment/Invoice";

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
  
  const { selectedDoctor, fetchDoctorByIdStatus, error } = useSelector((state) => state.doctors);
  const user = useSelector((state) => state.auth.user);
  const { appointments, status, errorA } = useSelector((state) => state.appointments);
  const { bookappointmentStatus, bookappointmentError } = useSelector((state) => state.appointments);

  // State variables for the booking flow
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);

  // We will store the previous doctorId to detect when it changes
  const [prevDoctorId, setPrevDoctorId] = useState(null);

  // Add console logs to check if the effect runs properly and states are resetting
  useEffect(() => {
    console.log("DoctorId Changed: ", doctorId); // Log doctorId change
    
    // If doctorId changes, reset all the states related to booking
    if (doctorId !== prevDoctorId) {
      setPrevDoctorId(doctorId); // Store the current doctorId
      setStep(1);  // Always start from Step 1 (Slot Selection)
      setSelectedDate(new Date()); // Reset selected date
      setSelectedSlot(null); // Reset selected slot
      console.log("State reset: ", { step, selectedDate, selectedSlot });
      
      // Dispatch actions to fetch new doctor and appointment slots
      dispatch(fetchDoctorById(doctorId));
      dispatch(fetchAppointmentSlots(doctorId));
    }
  }, [doctorId, dispatch, prevDoctorId]); // Dependency array ensures the effect runs when doctorId changes

  // Handle the next step in the booking flow
  const handleNext = () => {
    setStep(step + 1);
  };

  // Handle booking confirmation
  const handleBookingConfirm = (formData) => {
    console.log("Booking Confirmed", formData);
    
    // Dispatch the bookAppointment action when all data is collected
    dispatch(
      bookAppointment({
        doctorId: formData.doctorId,
        patientId: formData.patientId,
        date: formData.selectedDate,
        timeSlot: formData.selectedSlot,
        type: formData.serviceType,
      })
    );
  };

  // Handle successful booking confirmation
  useEffect(() => {
    if (bookappointmentStatus === "succeeded") {
      setStep(3); // Move to the confirmation step
    }
  }, [bookappointmentStatus, doctorId , dispatch ]);

  // Handle invoice view
  const handleViewInvoice = () => {
    setStep(4);
  };

  // Handle loading/error states
  if (fetchDoctorByIdStatus === "loading" || status === "loading") {
    return <div>Loading...</div>;
  }

  if (fetchDoctorByIdStatus === "failed" || status === "failed") {
    return <div>Error: {error || errorA}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Display selected doctor info */}
        <DoctorInfo doctor={selectedDoctor} />

        {/* Step 1: Slot Selection */}
        {step === 1 && (
          <SlotSelection
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedSlot={selectedSlot}
            doctor={selectedDoctor}
            appointmentSlots={appointments.availableSlots}
            setSelectedSlot={setSelectedSlot}
            onNext={handleNext}
          />
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <PersonalInfo
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            patient={user}
            onSubmit={handleBookingConfirm}
            doctor={selectedDoctor}
          />
        )}

        {/* Step 3: Booking Confirmation */}
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

        {/* Step 4: Invoice */}
        {step === 4 && <Invoice invoice={mockInvoice} doctor={selectedDoctor} patient={user} />}
      </div>
    </div>
  );
};

export default BookAppointment;
