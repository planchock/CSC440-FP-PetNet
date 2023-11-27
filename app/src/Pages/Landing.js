import "tailwindcss/tailwind.css";

function Landing() {
  return (
    <div className="flex items-center justify-center max-w-5xl min-h-screen mx-auto">
      <div className="flex items-center space-x-40">
        <div className="block">
          <h1 className="text-6xl font-extrabold text-black">
            Show off
            <br /> your pets.
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-neutral-50 drop-shadow-lg">
            Join the community.
          </h2>
          <div className="flex mt-2 space-x-4">
            <a href="signup" class="relative inline-block text-lg group">
              <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-pink-100"></span>
                <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span class="relative">Join Now</span>
              </span>
              <span
                class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </a>
            <a href="login" class="relative inline-block text-lg group">
              <span class="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                <span class="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-yellow-200"></span>
                <span class="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                <span class="relative">Log In</span>
              </span>
              <span
                class="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"
                data-rounded="rounded-lg"
              ></span>
            </a>
          </div>
        </div>
        <img src="/dog.webp" height={300} width={500} />
      </div>
    </div>
  );
}

export default Landing;
