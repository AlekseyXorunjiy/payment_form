import React from 'react'
import Image from 'next/image' // Импортируйте компонент Image из Next.js

type CardLogoProps = {
  cardType: string
}

const CardLogo: React.FC<CardLogoProps> = ({ cardType }) => {
  const cardTypeToImage: Record<string, string> = {
    Visa: 'images/visa.svg',
    Mastercard: 'images/mastercard.svg',
    Amex: 'images/amex.svg',
    default: 'images/unknown.svg'
  }

  let imageSource = cardTypeToImage[cardType] || cardTypeToImage.default

  return (
    <Image
      src={imageSource}
      alt={`Логотип ${cardType}`}
      width={75}
      height={75}
      priority={true}
    />
  )
}

export default CardLogo
