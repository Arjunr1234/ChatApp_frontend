
export const validateSignup = (name, phone, email, password) => {
    let errors = {}
  
    if (!name.trim()) errors.name = "Name is required!"
    if (!phone.trim()) errors.phone = "Phone number is required!"
    if (!email.trim()) {
      errors.email = "Email is required!"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format!"
    }
    if (!password.trim()) {
      errors.password = "Password is required!"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters!"
    }
  
    return errors
  }

  export const validateLogin = (email, password) => {
    const errors = {}
  
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format'
    }
  
    if (!password.trim()) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
  
    return errors
  }
  
  