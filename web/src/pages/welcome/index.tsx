import { Link } from 'react-router-dom'

function WelcomePage() {
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p className="mb-4">Here is some information about the website.</p>
      <Link
        to="/login"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </Link>
    </div>
  )
}

export default WelcomePage
