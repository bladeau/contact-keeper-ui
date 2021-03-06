import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'

import {
  ContactContext,
  ContactDispatchContext,
} from '../../context/contact/contactContext'

import {
  ADD_CONTACT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  CONTACT_ERROR,
} from '../../context/types'

const ContactForm = () => {
  const { current } = useContext(ContactContext)
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal',
  })

  useEffect(() => {
    if (current !== null) {
      setContact(current)
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal',
      })
    }
  }, [current])

  const dispatch = useContext(ContactDispatchContext)

  const addContact = async (contact) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    }
    try {
      //Update Database
      const res = await axios.post('/api/contacts', contact, config)
      //Update Context State based on response from server (the new record)
      dispatch({ type: ADD_CONTACT, payload: res.data })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.msg })
    }
  }

  const updateContact = async (contact) => {
    const config = {
      headers: { 'Content-Type': 'application/json' },
    }
    try {
      const res = await axios.put(
        `/api/contacts/${contact._id}`,
        contact,
        config
      )
      dispatch({ type: UPDATE_CONTACT, payload: res.data })
    } catch (err) {
      dispatch({ type: CONTACT_ERROR, payload: err.response.msg })
    }
  }

  const { name, email, phone, type } = contact

  const onChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    if (current === null) {
      addContact(contact)
    } else {
      updateContact(contact)
    }

    setContact({
      name: '',
      email: '',
      phone: '',
      type: 'personal',
    })
  }

  const clearAll = () => {
    dispatch({ type: CLEAR_CURRENT })
  }

  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        {current ? 'Edit Contact' : 'Add Contact'}
      </h2>
      <input
        type='text'
        placeholder='Name'
        name='name'
        value={name}
        onChange={onChange}
      />
      <input
        type='email'
        placeholder='Email'
        name='email'
        value={email}
        onChange={onChange}
      />
      <input
        type='text'
        placeholder='Phone'
        name='phone'
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={onChange}
      />
      Personal{' '}
      <input
        type='radio'
        name='type'
        value='professional'
        checked={type === 'professional'}
        onChange={onChange}
      />
      Professional
      <div>
        <input
          type='submit'
          value={current ? 'Update Contact' : 'Add Contact'}
          className='btn btn-primary btn-block'
        />
      </div>
      {current && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  )
}

export default ContactForm
