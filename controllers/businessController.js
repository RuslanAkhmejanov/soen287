import db from '../models/index.cjs';

export const saveBusinessInfo = async (req, res) => {
    const { name, hours, staffMembers, employees } = req.body;

    // Extract file paths from multer
    const logoUrl = req.files?.logo ? req.files.logo[0].path : null;
    const pictureUrls = req.files?.pictures
        ? req.files.pictures.map((file) => file.path).join(',')
        : null;

    // Process employee data
    const employeeData = employees
        ? Object.entries(employees).map(([index, employee]) => ({
              name: employee.name,
              bio: employee.bio,
              image: req.files[`employees[${index}][image]`]?.[0]?.path || employee.image || null,
          }))
        : [];

    try {
        // Find or create the business entry
        const existingBusiness = await db.Business.findOne({ where: { id: 1 } });

        if (existingBusiness) {
            await existingBusiness.update({
                name,
                hours,
                staffMembers,
                logo: logoUrl,
                pictures: pictureUrls,
                employees: JSON.stringify(employeeData),
            });
        } else {
            await db.Business.create({
                id: 1,
                name,
                hours,
                staffMembers,
                logo: logoUrl,
                pictures: pictureUrls,
                employees: JSON.stringify(employeeData),
            });
        }

        res.redirect('/settings');
    } catch (error) {
        console.error('Error saving business information:', error.message, error.stack);
        res.status(500).send('Error saving business information');
    }

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

};


