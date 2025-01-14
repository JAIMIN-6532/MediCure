import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ name, createdAt, rating, comment }) => {
  // Format the createdAt to display only the date (MM/DD/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Default format (MM/DD/YYYY)
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
            <img
              src={`https://placekitten.com/100/100`}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="ml-4">
            <h3 className="font-bold text-gray-800">{name}user</h3>
            <p className="text-sm text-gray-500">{createdAt && formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex text-yellow-400">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} className="w-5 h-5" />
          ))}
          {[...Array(5 - rating)].map((_, i) => (
            <FaStar key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
          ))}
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">{comment}</p>
    </div>
  );
};

export default ReviewCard;
