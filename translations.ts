
export type Language = 'en' | 'ar';

export const translations: Record<Language, any> = {
  en: {
    nav: {
      phase01: '01. SCAN',
      phase02: '02. PROTOCOLS',
      phase03: '03. SYNTHESIS',
      phase04: '04. ARCHIVE',
      store: 'STORE',
      about: 'ABOUT'
    },
    hero: {
      badge: 'Bio-Metric Verified AI Analysis',
      title: 'Metabolic',
      subtitle: 'Diagnostic.',
      desc: 'Analyze your biological signature through precision AI imaging. Decrypt ingredients and vitality scores in milliseconds.',
      cta: 'INITIALIZE SCAN'
    },
    about: {
      header: 'About Us',
      tagline: 'Our story of where it began',
      title: 'About Coffee Old Town',
      p1: 'At Coffee Old Town, we believe that every cup of coffee tells a story—a story of tradition, craftsmanship, and the simple joy of savoring life\'s moments.',
      p2: 'As a community-driven brand, we celebrate the art of coffee-making and the connections it fosters.',
      p3: 'Join us in honoring the heritage of coffee while embracing innovation and sustainability.',
      quote: 'Believing in yourself and knowing who you are is the foundation for achieving great things.',
      author: 'Meklad S.'
    },
    contact: {
      title: 'Contact',
      subtitle: 'Establish a connection with the lab',
      heading: 'Get in touch',
      desc: 'Our senior analysts are ready to process your inquiries regarding metabolic protocols or partnership opportunities.',
      emailLabel: 'Direct Link:',
      form: {
        name: 'Identifier Name',
        email: 'Digital Mail',
        subject: 'Inquiry Node',
        message: 'Your transmission...',
        send: 'Establish Connection',
        success: 'Transmission Sent'
      }
    }
  },
  ar: {
    nav: {
      phase01: '01. المسح الضوئي',
      phase02: '02. البروتوكولات',
      phase03: '03. التخليق',
      phase04: '04. الأرشيف',
      store: 'المتجر',
      about: 'عن المختبر'
    },
    hero: {
      badge: 'تحليل ذكاء اصطناعي موثق حيوياً',
      title: 'التشخيص',
      subtitle: 'الأيضي.',
      desc: 'حلل بصمتك البيولوجية من خلال تصوير دقيق بالذكاء الاصطناعي. فك شفرة المكونات ودرجات الحيوية في أجزاء من الثانية.',
      cta: 'بدء المسح الضوئي'
    },
    about: {
      header: 'من نحن',
      tagline: 'قصة البداية من قلب المختبر',
      title: 'عن كوفي أولد تاون',
      p1: 'في كوفي أولد تاون، نؤمن أن كل كوب قهوة يحكي قصة - قصة تقاليد وحرفية ومتعة بسيطة بتذوق لحظات الحياة.',
      p2: 'كعلامة تجارية مدفوعة بالمجتمع، نحن نحتفي بفن صنع القهوة والروابط التي تعززها.',
      p3: 'انضم إلينا في تكريم تراث القهوة مع تبني الابتكار والاستدامة.',
      quote: 'الإيمان بنفسك ومعرفة من أنت هو الأساس لتحقيق أشياء عظيمة.',
      author: 'مقلد س.'
    },
    contact: {
      title: 'اتصل بنا',
      subtitle: 'أنشئ اتصالاً مع المختبر',
      heading: 'تواصل معنا',
      desc: 'كبار المحللين لدينا مستعدون لمعالجة استفساراتكم بشأن بروتوكولات الأيض أو فرص الشراكة.',
      emailLabel: 'رابط مباشر:',
      form: {
        name: 'اسم المعرف',
        email: 'البريد الرقمي',
        subject: 'عقدة الاستفسار',
        message: 'رسالتك...',
        send: 'إرسال الإشارة',
        success: 'تم الإرسال بنجاح'
      }
    }
  }
};
