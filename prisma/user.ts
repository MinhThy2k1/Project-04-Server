enum UserRole {
    admin = 'admin',
    member = 'member',
}

export default [
    {
        userName: "admin",
        email: "minhthy031@gmail.com",
        emailConfirm: true,
        password: "$2b$10$MxOCvRasftHXk7WzbJvhEu9V.2T8NhzjZVBW8d1sxHMzQiT5J07v2",
        role: UserRole.admin,
        avatar: "https://www.cfisa.com/wp-content/themes/cfisa-2017/assets/images/course-avatars/cfisa-avatar.png",
        createAt: String(Date.now()),
        updateAt: String(Date.now()),
        ipList: "::ffff:127.0.0.1"
    }
]