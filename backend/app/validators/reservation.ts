import vine from '@vinejs/vine'

export const reservationValidator = vine.compile(
  vine.object({
    vehicleId: vine.number().exists(async (db, value) => {
      const vehicle = await db.from('vehicles').where('id', value).first()
      return !!vehicle
    }),
    startDate: vine.date(),
    endDate: vine.date(),
  })
)
