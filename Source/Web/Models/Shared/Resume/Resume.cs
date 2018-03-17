using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace JSM.Web.Models.Shared.Resume {
    [XmlRoot(Namespace = "http://joshmccullough.me/Content/Data/Resume.xsd/Resume.xsd")]
    public class Resume {
        public const string XmlDateTimeFormat = "yyyy-MM-dd";

        [XmlIgnore]
        public static Resume Instance { get; private set; }

        [XmlIgnore]
        private static FileSystemWatcher InstanceWatcher { get; set; }

        [XmlIgnore]
        public string FilePath { get; private set; }

        [XmlAttribute]
        public string FirstName { get; set; }

        [XmlAttribute]
        public string LastName { get; set; }

        [XmlAttribute]
        public string DisplayName { get; set; }

        [XmlAttribute]
        public string Email { get; set; }

        [XmlAttribute]
        public string Phone { get; set; }

        [XmlAttribute]
        public string Website { get; set; }

        [XmlAttribute]
        public DateTime LastUpdated { get; set; }

        [XmlElement("Tag")]
        public List<Tag> Tags { get; set; }

        [XmlElement("Section")]
        public List<Section> Sections { get; set; }

        public static void Initialize(string filePath, bool watch) {
            Instance = Load(filePath);

            if (watch && InstanceWatcher == null) {
                var watcher = new FileSystemWatcher(Path.GetDirectoryName(filePath), Path.GetFileName(filePath)) {
                    IncludeSubdirectories = false,
                    NotifyFilter = (NotifyFilters.Attributes | NotifyFilters.LastWrite),
                    EnableRaisingEvents = true
                };
                var handler = new FileSystemEventHandler((o, e) => {
                    Initialize(e.FullPath, false);
                });

                watcher.Changed += handler;
                watcher.Created += handler;

                InstanceWatcher = watcher;
            }
        }

        public static Resume Load(string filePath) {
            if (!File.Exists(filePath))
                throw new FileNotFoundException(filePath);

            Resume resume = null;

            using (Stream stream = File.Open(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
                resume = Load(stream);
                resume.FilePath = filePath;
            }

            return resume;
        }

        public static Resume Load(Stream stream) {
            XmlSerializer serializer = new XmlSerializer(typeof(Resume));
            Resume resume = null;

            try {
                resume = (Resume)serializer.Deserialize(stream);
            }
            catch (Exception ex) {
                throw new ApplicationException("Unable to deserialize resume.", ex);
            }

            return resume;
        }

        public Section FindSection(string key) {
            return this.Sections.FirstOrDefault(o => string.Equals(o.Key, key));
        }
    }
}