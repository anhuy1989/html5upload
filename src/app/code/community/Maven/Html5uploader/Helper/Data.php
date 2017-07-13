<?php
/**
 * Created by PhpStorm.
 * User: developer
 * Date: 11.08.16
 * Time: 14:26
 */ 
class Maven_Html5uploader_Helper_Data extends Mage_Core_Helper_Abstract {

    const BEFORE_8788 = 'Mage_Adminhtml_Block_Media_Uploader';

    public function ifPatch8788NotAppied(Maven_Html5uploader_Block_Adminhtml_Cms_Wysiwyg_Images_Content_Uploader $obj)
    {
        $patchNotApplied  = false;
        $parentClasses = class_parents($obj);
        if (isset($parentClasses[self::BEFORE_8788])) {
            $patchNotApplied = true;
        }
        return $patchNotApplied;
    }
}