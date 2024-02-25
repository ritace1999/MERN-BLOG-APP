import { useState } from "react";
import { MainLayout } from "../../components/MainLayout";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import {
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineInstagram,
} from "react-icons/ai";
import { images } from "../../constants";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <MainLayout>
      <div className="md:grid md:grid-cols-2 my-3 mx-auto w-[90%] overflow-hidden rounded-lg bg-dark-hard shadow-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-30">
        {/* Contact Form */}
        <div className="flex flex-col py-20 items-center w-full md:ml-10 px-5 lg:ml-10">
          <h1 className="text-2xl font-extrabold text-dark-hard mb-4">
            Contact Us
          </h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name..."
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email..."
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Enter your message here..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="flex mx-auto flex-col my-5 ">
          <img
            src={images.ContactUs}
            alt="contact-us"
            className="hidden md:block lg:w-[450px] md:w-[250px]"
          />
          <div className="mx-auto">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="flex items-center mb-4">
              <FaMapMarkerAlt className="text-gray-600 mr-2" />
              <p>123 Main Street, City, Country</p>
            </div>
            <div className="flex items-center mb-4">
              <FaEnvelope className="text-gray-600 mr-2" />
              <p>info@example.com</p>
            </div>
            <div className="flex items-center mb-4">
              <FaPhone className="text-gray-600 mr-2" />
              <p>+123 456 7890</p>
            </div>
            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  <AiOutlineTwitter className="text-2xl" />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  <AiOutlineFacebook className="text-2xl" />
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-700">
                  <AiOutlineInstagram className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUs;
