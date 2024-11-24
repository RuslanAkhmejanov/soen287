import db from '../models/index.cjs';

const safeParseJSON = (json) => {
    try {
        return typeof json === 'string' ? JSON.parse(json) : json;
    } catch (error) {
        console.error('JSON parsing error:', error);
        return [];
    }
};

export const saveBusinessInfo = async (req, res) => {
    const { name, hours, staffMembers, services } = req.body;

    const logoUrl = req.files?.logo?.[0]?.path || null;
    const backgroundPicUrl = req.files?.backgroundPic?.[0]?.path || null;

    // Safely parse the fields
    const parsedStaffMembers = safeParseJSON(staffMembers);
    const parsedServices = safeParseJSON(services);

    const staffMemberData = parsedStaffMembers.map((staffMember, index) => ({
        name: staffMember.name,
        bio: staffMember.bio,
        image: req.files[`staffMembers[${index}][image]`]?.[0]?.path || staffMember.image || null,
    }));

    const serviceData = parsedServices.map((service, index) => ({
        name: service.name,
        description: service.description,
        image: req.files[`services[${index}][image]`]?.[0]?.path || service.image || null,
    }));

    try {
        const business = await db.Business.findOne({ where: { id: 1 } });

        if (business) {
            await business.update({
                name: name || business.name,
                hours: JSON.parse(hours || '{}'),
                staffMembers: JSON.stringify(staffMemberData),
                services: JSON.stringify(serviceData),
                logo: logoUrl || business.logo,
                backgroundPic: backgroundPicUrl || business.backgroundPic,
            });
        } else {
            await db.Business.create({
                name: name || 'Your Business Name',
                hours: JSON.parse(hours || '{}'),
                staffMembers: JSON.stringify(staffMemberData),
                services: JSON.stringify(serviceData),
                logo: logoUrl,
                backgroundPic: backgroundPicUrl,
            });
        }

        res.redirect('/settings');
    } catch (error) {
        console.error('Error saving business information:', error.message);
        res.status(500).send('Error saving business information');
    }

    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
};

