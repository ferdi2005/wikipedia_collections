<?php

namespace AppBundle\Helper;

class Wikipedia {
    
    public static $ALL_LANGUAGES = [
        'en' => 'English',
        'sv' => 'Svenska',
        'nl' => 'Nederlands',
        'de' => 'Deutsch',
        'fr' => 'Français',
        'war' => 'Winaray',
        'ru' => 'Русский',
        'ceb' => 'Sinugboanong Binisaya',
        'it' => 'Italiano',
        'es' => 'Español',
        'vi' => 'Tiếng Việt',
        'pl' => 'Polski',
        'ja' => '日本語',
        'pt' => 'Português',
        'zh' => '中文',
        'uk' => 'Українська',
        'ca' => 'Català',
        'fa' => 'فارسی',
        'no' => 'Norsk (Bokmål)',
        'sh' => 'Srpskohrvatski / Српскохрватски',
        'fi' => 'Suomi',
        'id' => 'Bahasa Indonesia',
        'ar' => 'العربية',
        'cs' => 'Čeština',
        'sr' => 'Српски / Srpski',
        'ko' => '한국어',
        'hu' => 'Magyar',
        'ro' => 'Română',
        'ms' => 'Bahasa Melayu',
        'tr' => 'Türkçe',
        'min' => 'Minangkabau',
        'eo' => 'Esperanto',
        'kk' => 'Қазақша',
        'eu' => 'Euskara',
        'sk' => 'Slovenčina',
        'da' => 'Dansk',
        'bg' => 'Български',
        'lt' => 'Lietuvių',
        'he' => 'עברית',
        'hy' => 'Հայերեն',
        'hr' => 'Hrvatski',
        'sl' => 'Slovenščina',
        'et' => 'Eesti',
        'uz' => 'O‘zbek',
        'gl' => 'Galego',
        'nn' => 'Nynorsk',
        'vo' => 'Volapük',
        'la' => 'Latina',
        'simple' => 'Simple English',
        'el' => 'Ελληνικά',
        'hi' => 'हिन्दी',
        'az' => 'Azərbaycanca',
        'th' => 'ไทย',
        'ka' => 'ქართული',
        'oc' => 'Occitan',
        'be' => 'Беларуская',
        'mk' => 'Македонски',
        'ce' => 'Нохчийн',
        'mg' => 'Malagasy',
        'new' => 'नेपाल भाषा',
        'ur' => 'اردو',
        'tt' => 'Tatarça / Татарча',
        'ta' => 'தமிழ்',
        'pms' => 'Piemontèis',
        'cy' => 'Cymraeg',
        'tl' => 'Tagalog',
        'te' => 'తెలుగు',
        'lv' => 'Latviešu',
        'bs' => 'Bosanski',
        'be-x-old' => 'Беларуская (тарашкевіца)',
        'br' => 'Brezhoneg',
        'ht' => 'Krèyol ayisyen',
        'sq' => 'Shqip',
        'jv' => 'Basa Jawa',
        'lb' => 'Lëtzebuergesch',
        'mr' => 'मराठी',
        'is' => 'Íslenska',
        'ml' => 'മലയാളം',
        'zh-yue' => '粵語',
        'bn' => 'বাংলা',
        'af' => 'Afrikaans',
        'ba' => 'Башҡорт',
        'pnb' => 'شاہ مکھی پنجابی (Shāhmukhī Pañjābī)',
        'ga' => 'Gaeilge',
        'lmo' => 'Lumbaart',
        'fy' => 'Frysk',
        'tg' => 'Тоҷикӣ',
        'yo' => 'Yorùbá',
        'cv' => 'Чăваш',
        'my' => 'မြန်မာဘာသာ',
        'an' => 'Aragonés',
        'sco' => 'Scots',
        'sw' => 'Kiswahili',
        'ky' => 'Кыргызча',
        'io' => 'Ido',
        'ne' => 'नेपाली',
        'gu' => 'ગુજરાતી',
        'scn' => 'Sicilianu',
        'bpy' => 'ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী',
        'nds' => 'Plattdüütsch',
        'ku' => 'Kurdî / كوردی',
        'ast' => 'Asturianu',
        'qu' => 'Runa Simi',
        'als' => 'Alemannisch',
        'su' => 'Basa Sunda',
        'kn' => 'ಕನ್ನಡ',
        'pa' => 'ਪੰਜਾਬੀ',
        'ckb' => 'Soranî / کوردی',
        'ia' => 'Interlingua',
        'nap' => 'Nnapulitano',
        'mn' => 'Монгол',
        'bug' => 'Basa Ugi',
        'bat-smg' => 'Žemaitėška',
        'arz' => 'مصرى (Maṣri)',
        'wa' => 'Walon',
        'zh-min-nan' => 'Bân-lâm-gú',
        'map-bms' => 'Basa Banyumasan',
        'gd' => 'Gàidhlig',
        'yi' => 'ייִדיש',
        'mzn' => 'مَزِروني',
        'am' => 'አማርኛ',
        'si' => 'සිංහල',
        'fo' => 'Føroyskt',
        'bar' => 'Boarisch',
        'vec' => 'Vèneto',
        'nah' => 'Nāhuatl',
        'sah' => 'Саха тыла (Saxa Tyla)',
        'os' => 'Иронау',
    ];

    public static function getLangLinks($language, $title) {
        $page = self::getFirstPage(
            self::executeQuery($language, [
                'action' => 'query',
                'prop' => 'langlinks',
                'format' => 'json',
                'titles' => $title,
                'lllimit' => 200,
            ])
        );
        
        if ($page && isset($page['langlinks'])) { return $page['langlinks']; }
        return null;
    }
    
    public static function getArticle($language, $title) {
        return self::getFirstPage(
            self::executeQuery($language, [
                'action' => 'query',
                'prop' => 'revisions',
                'format' => 'json',
                'rvprop' => 'content',
                'rvparse' => 'rvparse',
                'titles' => $title,
            ])
        );
    }

    public static function executeQuery($language, $data) {
        if (!isset($data['continue'])) {
            $data['continue'] = '';
        }
        
        $params = [];
        foreach ($data as $key => $value) {
            $params[] = urlencode($key) . '=' . urlencode($value);
        }
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $language . ".wikipedia.org/w/api.php?" . implode('&', $params),
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_POST => true,
        ]);
        $output = curl_exec($ch);
        curl_close($ch);
        return json_decode($output, true);
    }
    
    public static function getFirstPage($data) {
        if (!$data) { return $data; }
        return array_values($data['query']['pages'])[0];
    }
}