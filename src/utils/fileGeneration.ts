export const generateICS = (eventName: string, date: string, time?: string, location?: string): string => {
  let dtstart = date.replace(/-/g, '');
  if (time) {
    const [hours, minutes] = time.split(':');
    dtstart += `T${hours}${minutes}00`;
  } else {
    dtstart += 'T000000';
  }

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Clearshot//EN
BEGIN:VEVENT
UID:clearshot-${Date.now()}@clearshot.app
DTSTART:${dtstart}
SUMMARY:${eventName}
${location ? `LOCATION:${location}` : ''}
DESCRIPTION:Added via Clearshot
END:VEVENT
END:VCALENDAR`;
};

export const generateVCF = (name: string, phone?: string, email?: string, address?: string): string => {
  return `BEGIN:VCARD
VERSION:3.0
FN:${name}
${phone ? `TEL:${phone}` : ''}
${email ? `EMAIL:${email}` : ''}
${address ? `ADR:${address}` : ''}
END:VCARD`;
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
