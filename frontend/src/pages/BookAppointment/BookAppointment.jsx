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
  console.log("selectedDoctor", selectedDoctor);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [prevDoctorId, setPrevDoctorId] = useState(null);

  // Fetch doctor data and appointment slots on doctorId change
  useEffect(() => {
    if (doctorId !== prevDoctorId) {
      setPrevDoctorId(doctorId);
      dispatch(fetchDoctorById(doctorId));
      dispatch(fetchAppointmentSlots(doctorId));
    }
  }, [doctorId, dispatch, prevDoctorId]);

  // Handle next step
  const handleNext = () => {
    setStep(step + 1);
  };

  // Handle booking confirmation
  const handleBookingConfirm = (formData) => {
    console.log("Booking Confirmed", formData);
    
    // Dispatch the bookAppointment action only when all data is collected
    dispatch(bookAppointment({
      doctorId: formData.doctorId,
      patientId: formData.patientId,
      date: formData.selectedDate,
      timeSlot: formData.selectedSlot,
    }));
  };

  // Handle booking confirmation success
  useEffect(() => {
    if (bookappointmentStatus === 'succeeded') {
      setStep(3); // Go to confirmation page
    }
  }, [bookappointmentStatus]);

  // Handle invoice view
  const handleViewInvoice = () => {
    setStep(4);
  };

  // Handle loading/error states
  if (fetchDoctorByIdStatus === 'loading' || status === 'loading') {
    return <div>Loading...</div>;
  }

  if (fetchDoctorByIdStatus === 'failed' || status === 'failed') {
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
            appointmentSlots={appointments.availableSlots}
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
        {step === 4 && <Invoice invoice={mockInvoice} doctor={selectedDoctor} patient={user} />}
      </div>
    </div>
  );
};

export default BookAppointment;
