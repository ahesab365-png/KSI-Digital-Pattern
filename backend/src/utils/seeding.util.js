import bcrypt from 'bcrypt'
import { UserModel } from '../DB/model/user.model.js'

export const seedDefaultAdmin = async () => {
    try {
        const admins = [
            { email: 'Shimaaelnagaar444@gmail.com', password: 'Shim@444#KSI_2026', role: 'superadmin' },
            { email: 'ibrahimelgohary314@gmail.com', password: 'Ibr@314#KSI_2026', role: 'superadmin' },
            { email: 'khokhaemad88@gmail.com', password: 'Kho@88#KSI_2026', role: 'superadmin' }
        ]

        for (const admin of admins) {
            const adminExists = await UserModel.findOne({ email: admin.email })
            if (!adminExists) {
                const hashedPassword = await bcrypt.hash(admin.password, 8)
                await UserModel.create({
                    email: admin.email,
                    password: hashedPassword,
                    role: admin.role
                })
                console.log(`✅ Admin Created: ${admin.email}`)
            }
        }
    } catch (error) {
        console.error('❌ Error seeding admins:', error.message)
    }
}
