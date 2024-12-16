import { useState, useEffect } from 'react'

function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log('Component mounted', window.api)

    // Fetch users when the component mounts
    window.api.getUsers().then((data) => {
      console.log('Fetched users:', data)
      setUsers(data)
    })
  }, [])

  const addUser = async () => {
    const newUser = { name: 'New User', age: 40 }
    const updatedUsers = await window.api.addUser(newUser)
    setUsers(updatedUsers)
  }

  const sendPing = () => {
    window.api.sendPing()
  }

  return (
    <div>
      <h1>Electron Home</h1>
      <button onClick={sendPing}>Send Ping</button>
      <button onClick={addUser}>Add User</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.age} years old
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home
