export default function Login() {
  return (
    <div className="flex min-h-screen flex-col p-5 space-y-4">
      <label htmlFor="email" className="text-sm font-medium leading-6 text-gray-900">Email</label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          className="block w-full rounded-md
          border-0 py-1.5 pl-7 pr-20 text-gray-900
          ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          ocus:ring-2 focus:ring-inset focus:ring-blue-600
          sm:text-sm sm:leading-6"
         placeholder="a@example.com" type="email" name="email"
         />
      </div>
      <label htmlFor="password" className="text-sm font-medium leading-6 text-gray-900">Password</label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          className="block w-full rounded-md
          border-0 py-1.5 pl-7 pr-20 text-gray-900
          ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
          ocus:ring-2 focus:ring-inset focus:ring-blue-600
          sm:text-sm sm:leading-6"
          type="password"
          name="password"
        />
      </div>
      <button className="py-1.5">Login</button>
    </div>
  );
};