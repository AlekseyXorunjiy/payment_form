'use client'
import React, { useState, useRef, useEffect, ChangeEvent } from 'react'
import { useForm, Controller, FieldValues } from 'react-hook-form'
import InputElement from '../Input/Input'
import CardLogo from '../CardLogo/CardLogo'
import { Button } from '../Button'
import validateCardNumber from '@/app/utils/validateCardNumber'

type Inputs = {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolder: string
}

const PaymentForm: React.FC = () => {
  const [wasBlurred, setWasBlurred] = useState(false)
  const {
    handleSubmit,
    control,
    watch,
    formState,
    setError,
    reset,
    clearErrors
  } = useForm<Inputs>()
  const { isDirty, isValid } = formState
  const [expiryValid, setExpiryValid] = useState(true)

  const expiryDateRef = useRef<HTMLInputElement | null>(null)
  const cvvRef = useRef<HTMLInputElement | null>(null)
  const cardHolderRef = useRef<HTMLInputElement | null>(null)

  const onSubmit = (data: Inputs) => {
    console.log(data)
    setWasBlurred(false)
    reset()
  }

  const cardNumber = watch('cardNumber')
  const expiryDate = watch('expiryDate')

  const cardType = cardNumber?.startsWith('4')
    ? 'Visa'
    : cardNumber?.startsWith('5')
    ? 'Mastercard'
    : cardNumber?.startsWith('3')
    ? 'Amex'
    : 'Неизвестная карта'

  const formatCardNumber = (inputValue: string) => {
    const digitsOnly = inputValue.replace(/\D/g, '')
    let sanitizedValue = digitsOnly

    if (digitsOnly.length < 16 || digitsOnly.length > 19) {
      setError('cardNumber', {
        type: 'manual',
        message: 'Номер карты должен содержать от 16 до 19 цифр'
      })
      return inputValue
    }

    const isValid = validateCardNumber(digitsOnly)

    if (!isValid) {
      setError('cardNumber', {
        type: 'manual',
        message: 'Неправильный номер карты'
      })
    } else {
      clearErrors('cardNumber')
    }

    return sanitizedValue
  }

  const formatExpiryDate = (inputValue: string) => {
    let sanitizedValue = inputValue.replace(/[^0-9/]/g, '')

    if (sanitizedValue.length === 2 && inputValue.charAt(2) !== '/') {
      sanitizedValue += '/'
    }

    if (sanitizedValue.length === 3 && inputValue.charAt(2) === '/') {
      sanitizedValue = sanitizedValue.substring(0, 2)
    }

    if (sanitizedValue.length > 5) {
      sanitizedValue = sanitizedValue.substring(0, 5)
    }

    setExpiryValid(() => {
      const [month, year] = sanitizedValue.split('/')
      return (
        /^\d{2}\/\d{2}$/.test(sanitizedValue) &&
        parseInt(month, 10) <= 12 &&
        year >= new Date().getFullYear().toString().substr(-2)
      )
    })

    return sanitizedValue
  }

  useEffect(() => {
    if (expiryValid && expiryDate && expiryDate.length === 5) {
      cvvRef.current?.focus()
    }
  }, [expiryValid, expiryDate])

  useEffect(() => {
    !formState.errors.cardNumber && wasBlurred && expiryDateRef.current?.focus()
  }, [formState.errors.cardNumber, wasBlurred, cardNumber])

  const handleCVVChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: FieldValues['cvv']
  ) => {
    const inputValue = e.target.value.replace(/\D/g, '')
    field.onChange(inputValue)

    cardType !== 'Amex' &&
      /^\d{3}$/.test(inputValue) &&
      cardHolderRef.current?.focus()

    cardType === 'Amex' &&
      /^\d{4}$/.test(inputValue) &&
      cardHolderRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card rounded-xl items-center justify-center font-mono text-sm w-[700px] h-[450px] text-white relative"
    >
      <div className="p-4 flex flex-col gap-y-6">
        <div className="h-24">
          <div className="w-full bg-black h-20 top-5 absolute left-0" />
        </div>
        <div>
          <Controller
            name="cardNumber"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <>
                <InputElement
                  {...field}
                  type="text"
                  onChange={(e) => {
                    field.onChange(
                      wasBlurred
                        ? formatCardNumber(e.target.value.replace(/\D/g, ''))
                        : e.target.value.replace(/\D/g, '')
                    )
                  }}
                  onBlur={(e) => {
                    setWasBlurred(true)
                    field.onChange(
                      formatCardNumber(e.target.value.replace(/\D/g, ''))
                    )
                  }}
                  placeholder="Номер карты: XXXX XXXX XXXX XXXX"
                  maxLength={19}
                />
                <span className="h-[17px] block">
                  {formState.errors.cardNumber &&
                    formState.errors.cardNumber.message}
                </span>
              </>
            )}
          />
        </div>
        <div className="flex gap-x-8 items-center">
          <div>
            <Controller
              name="expiryDate"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <InputElement
                  {...field}
                  type="text"
                  ref={expiryDateRef}
                  onChange={(e) => {
                    field.onChange(formatExpiryDate(e.target.value))
                  }}
                  onBlur={(e) => {
                    field.onChange(formatExpiryDate(e.target.value))
                  }}
                  placeholder="Дата: MM/YY"
                />
              )}
            />
          </div>
          <div>
            <Controller
              name="cvv"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <InputElement
                  {...field}
                  type="text"
                  placeholder={cardType === 'Amex' ? 'CVV: XXXX' : 'CVV: XXX'}
                  maxLength={cardType === 'Amex' ? 4 : 3}
                  ref={cvvRef}
                  onChange={(e) => handleCVVChange(e, field)}
                />
              )}
            />
          </div>
          <CardLogo cardType={cardType} />
        </div>
        <div className="relative">
          <span className="h-[17px] absolute -top-10">
            {!expiryValid &&
              'Неверный формат срока действия или истекшая карта'}
          </span>
          <Controller
            name="cardHolder"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <InputElement
                {...field}
                ref={cardHolderRef}
                type="text"
                onChange={(e) => {
                  const sanitizedValue = e.target.value
                    .replace(/\d/g, '')
                    .toLocaleUpperCase()
                  const truncatedValue = sanitizedValue.substring(0, 25)
                  field.onChange(truncatedValue)
                }}
                placeholder="Владелец карты"
              />
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" disabled={!isDirty || !isValid || !expiryValid}>
            Оплатить
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PaymentForm
