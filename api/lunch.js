// Vercel Serverless Function to fetch Linq Connect Menu
// We use an internal API endpoint often used by their mobile apps
import axios from 'axios';

export default async function handler(req, res) {
  // Your specific LINQ ID for FSA766
  const MENU_IDENTIFIER = "FSA766";

  try {
    // 1. First we need to resolve the ID to get the actual API token/details
    // This uses a public endpoint Linq uses to load the menu page data
    const initialResponse = await axios.get(`https://linqconnect.com/api/getMenuLayout?identifier=${MENU_IDENTIFIER}`);

    const { districtId, buildingId } = initialResponse.data.familyMenuId;

    // 2. Fetch the actual menu data
    const today = new Date();
    const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Fetch a 7-day range to ensure we get the whole week
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const endDate = nextWeek.toISOString().split('T')[0];

    const menuUrl = `https://linqconnect.com/api/FamilyMenu?buildingId=${buildingId}&districtId=${districtId}&startDate=${startDate}&endDate=${endDate}`;

    const menuResponse = await axios.get(menuUrl);

    res.status(200).json(menuResponse.data);
  } catch (error) {
    console.error('Lunch Fetch Error:', error);
    // Fallback: If API fails, return error so UI can show a fallback message
    res.status(500).json({ error: 'Failed to fetch lunch menu' });
  }
}