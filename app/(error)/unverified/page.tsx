import Image from "next/image";

const UnverifiedPage = () => {
  return (
    <div
      id="oopss"
      className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-full h-full min-h-screen text-center flex items-center flex-col p-6 absolute top-0 right-0 bottom-0 left-0  z-50"
    >
      <Image src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt="404" width={400} height={400} />
      <div className="flex flex-col gap-3">
        <span className="sm:text-3xl text-2xl font-semibold">Please wait for the admin to verify your account</span>
        <p className="text-xl">Clear the cookies to go back to the login page.</p>
      </div>
    </div>
  );
};

export default UnverifiedPage;
