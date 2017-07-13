<?php
/**
 * Created by PhpStorm.
 * User: developer
 * Date: 21.10.16
 * Time: 18:11
 */ 
class Maven_Html5uploader_Block_Uploader_Multiple extends Mage_Uploader_Block_Multiple 
{
    public function __construct()
    {
        parent::__construct();
        if (Mage::getStoreConfig('maven/config/enable')) {
            $this->setTemplate('maven/uploader/1.9.3/uploader.phtml');
        }
    }

    protected function _prepareLayout()
    {
        if (Mage::getStoreConfig('maven/config/enable')) {
            return $this;
        }
        else {
            parent::_prepareLayout();
        }
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