<?php
/**
 * Created by PhpStorm.
 * User: developer
 * Date: 11.08.16
 * Time: 14:32
 */ 
class Maven_Html5uploader_Block_Adminhtml_Media_Uploader extends Mage_Adminhtml_Block_Media_Uploader
{

    public function __construct()
    {
        parent::__construct();
        if (Mage::getStoreConfig('maven/config/enable')) {
            $this->setTemplate('maven/uploader/uploader.phtml');
        }
    }

    protected function _prepareLayout()
    {
        return $this;
    }

    public function getMaxFileSize()
    {
        $res = array(
            ini_get('post_max_size'),
            ini_get('upload_max_filesize'),
        );
        $min = min($res);
        return (int)$min * 1000000;
    }
}