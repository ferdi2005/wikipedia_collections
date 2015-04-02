<?php

namespace AppBundle\Helper;

class Wikipedia {

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