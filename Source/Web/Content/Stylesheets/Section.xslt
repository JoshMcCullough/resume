<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0" xmlns:R="http://joshmccullough.me/Content/Data/Resume.xsd/Resume.xsd" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" exclude-result-prefixes="msxsl">
    <xsl:output method="html" indent="yes"/>

    <xsl:template match="R:Section">
        <xsl:call-template name="Heading">
            <xsl:with-param name="level" select="1 + count(ancestor::R:Section)"/>
            <xsl:with-param name="content" select="@Title"/>
        </xsl:call-template>

        <xsl:apply-templates/>
    </xsl:template>
    
    <xsl:template match="R:History">
        <xsl:call-template name="Heading">
            <xsl:with-param name="level" select="1 + count(ancestor::R:Section)"/>
            <xsl:with-param name="class" select="history-item"/>
            <xsl:with-param name="content">
                <xsl:element name="span">
                    <xsl:attribute name="class">row</xsl:attribute>
                    
                    <xsl:element name="span">
                        <xsl:attribute name="class">col-md-3</xsl:attribute>
                        <xsl:value-of select=""/>
                    </xsl:element>
                </xsl:element>
            </xsl:with-param>
        </xsl:cl-template>
    </xsl:template>

    <xsl:template match="R:Heading">
        <xsl:call-template name="Heading">
            <xsl:with-param name="level" select="@Level"/>
            <xsl:with-param name="content" select="text()"/>
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template name="Heading">
        <xsl:param name="level" select="1"/>
        <xsl:param name="class"/>
        <xsl:param name="content"/>
        
        <xsl:variable name="elementName">
            <xsl:text>h</xsl:text>
            <xsl:value-of select="$level"/>
            
            <xsl:if test="@class">
                <xsl:attribute name="class">
                    <xsl:value-of select="$class"/>
                </xsl:attribute>
            </xsl:if>
        </xsl:variable>
        
        <xsl:element name="{$elementName}">
            <xsl:value-of select="$content"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="R:Paragraph">
        <xsl:element name="p">
            <xsl:value-of select="text()"/>
        </xsl:element>
    </xsl:template>

    <xsl:template match="R:List">
        <xsl:variable name="elementName">
            <xsl:choose>
                <xsl:when test="@Type='Ordered'">
                    <xsl:text>ol</xsl:text>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:text>ul</xsl:text>
                </xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:element name="{$elementName}">
            <xsl:for-each select="R:Item">
                <xsl:element name="li">
                    <xsl:apply-templates/>
                </xsl:element>
            </xsl:for-each>
        </xsl:element>
    </xsl:template>
    
    <xsl:template match="*">
        <xsl:message terminate="no">
            WARNING: Unmatched element: <xsl:value-of select="name()"/>
        </xsl:message>
        
        <xsl:apply-templates/>
    </xsl:template>
</xsl:stylesheet>
