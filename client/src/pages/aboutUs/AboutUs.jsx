import { MainLayout } from "../../components/MainLayout";
import { images } from "../../constants";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="md:grid md:grid-cols-2  my-5 mx-auto w-[90%] overflow-hidden rounded-lg bg-dark-hard shadow-md bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-30">
        <div className="flex flex-col py-5 items-center w-full md:ml-10 px-5 lg:ml-10">
          <h1 className="text-2xl font-extrabold text-dark-hard "> About Us</h1>
          <p className="text-dark-hard py-3">
            Welcome to [Blog App], your go-to platform for discovering
            insightful articles, engaging stories, and thought-provoking content
            on a wide range of topics.
          </p>
          <h1 className="text-2xl font-extrabold text-dark-hard">
            {" "}
            Our Mission
          </h1>
          <p className="text-dark-hard py-3">
            At [Blog App], our mission is to provide a platform where writers
            can share their knowledge, experiences, and perspectives with
            readers from around the world. We believe in the power of
            storytelling to inspire, educate, and connect people from diverse
            backgrounds and cultures.
          </p>
          <h1 className="text-2xl font-extrabold text-dark-hard">
            {" "}
            What We Offer
          </h1>
          <p className="text-dark-hard py-3">
            <li className="">
              Diverse Content: From technology and science to lifestyle and
              arts, we cover a broad spectrum of topics to cater to various
              interests and preferences.
            </li>
            <li>
              Quality Writing: Our team of writers consists of experts,
              enthusiasts, and passionate individuals who are dedicated to
              delivering high-quality content that informs, entertains, and
              enlightens our readers.
            </li>
            <li>
              Engaging Community: Join our community of readers and writers to
              connect with like-minded individuals, share your thoughts, and
              participate in meaningful discussions.
            </li>
            <li>
              User-Friendly Experience: We strive to make your browsing
              experience seamless and enjoyable by providing a user-friendly
              interface, easy navigation, and responsive design.
            </li>
          </p>
          <h1 className="text-2xl font-extrabold text-dark-hard">
            {" "}
            Get Involved
          </h1>
          <p className="text-dark-hard py-3">
            Whether you're a reader looking for interesting articles or a writer
            eager to share your stories, there's a place for you at [Blog App].
            Explore our platform, discover new content, and join us on this
            journey of exploration, learning, and discovery.
          </p>
        </div>
        <div className="hidden md:block sticky my-12 md:items-center lg:ml-48 md:ml-20 rounded-xl  w-full md:w-[70%]">
          <img
            src={images.AboutBg}
            alt="image"
            className=" shadow-2xl shadow-blue-500/60 rounded-xl"
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
