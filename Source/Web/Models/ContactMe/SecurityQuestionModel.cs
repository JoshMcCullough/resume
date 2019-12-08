using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.Mvc;
using QuantumConcepts.Common.Extensions;
using System.Text;

namespace JSM.Web.Models.ContactMe {
    public sealed class SecurityQuestionModel {
        public bool IsValid { get; private set; }

        [HiddenInput]
        public string Key { get; set; }

        public string Question { get; private set; }

        [DataType(DataType.Text)]
        [CustomValidation(typeof(SecurityQuestionModel), "ValidateAnswer")]
        public string Answer { get; set; }

        public void Random() {
            SecurityQuestion question = SecurityQuestion.GetRandom();

            this.IsValid = false;
            this.Key = question.Key;
            this.Question = question.Question;
            this.Answer = null;
        }

        public static ValidationResult ValidateAnswer(string answer, ValidationContext validationContext) {
            SecurityQuestionModel model = (SecurityQuestionModel)validationContext.ObjectInstance;
            SecurityQuestion securityQuestion = SecurityQuestion.GetByKey(model.Key);
            ValidationResult result = null;

            if (securityQuestion == null)
                result = new ValidationResult("Sorry, couldn't find the answer to that question. Please answer the new question, above.");
            else if (!securityQuestion.Answer.Equals(answer))
                result = new ValidationResult("Sorry, that answer is incorrect. Please answer the new question, above.");

            if (result == null) {
                model.IsValid = true;
                model.Question = securityQuestion.Question;
                result = ValidationResult.Success;
            }

            return result;
        }

        private sealed class SecurityQuestion {
            private const int QuestionPerCategory = 100;

            private static readonly ReadOnlyDictionary<string, SecurityQuestion> Cache = null;
            private static readonly Random Random = new Random();

            public string Key { get; private set; }
            public string Question { get; private set; }
            public string Answer { get; private set; }

            static SecurityQuestion() {
                List<Func<SecurityQuestion>> generators = new List<Func<SecurityQuestion>>(){
                SecurityQuestion.GenerateMathQuestion
            };
                Dictionary<string, SecurityQuestion> cachedQuestions = new Dictionary<string, SecurityQuestion>();

                foreach (var generator in generators) {
                    for (int i = 0; i < SecurityQuestion.QuestionPerCategory; i++) {
                        SecurityQuestion question = generator();

                        cachedQuestions.Add(question.Key, question);
                    }
                }

                SecurityQuestion.Cache = new ReadOnlyDictionary<string, SecurityQuestion>(cachedQuestions);
            }

            private SecurityQuestion(string key, string question, string answer) {
                this.Key = key;
                this.Question = question;
                this.Answer = answer;
            }

            private static string GenerateKey() {
                return Guid.NewGuid().ToString("N");
            }

            private static SecurityQuestion GenerateMathQuestion() {
                const string OperatorAddition = "+";
                const string OperatorSubtraction = "-";
                const string QuestionTextPartFormat = " {0} ";

                Dictionary<string, Func<decimal, decimal, decimal>> operatorMap = new Dictionary<string, Func<decimal, decimal, decimal>>(){
                    {OperatorAddition, decimal.Add},
                    {OperatorSubtraction, decimal.Subtract}
                };
                Dictionary<string, string[]> operatorAliases = new Dictionary<string, string[]>() {
                    {OperatorAddition, new [] { OperatorAddition, "plus", "add"}},
                    {OperatorSubtraction, new [] { OperatorSubtraction, "minus", "take away"}}
                };
                int length = SecurityQuestion.Random.Next(2, 5);
                decimal total = 0;
                StringBuilder questionText = new StringBuilder();

                for (int i = 0; i < length; i++) {
                    int value = SecurityQuestion.Random.Next(0, 11);

                    if (i == 0) {
                        questionText.AppendFormat(QuestionTextPartFormat, value);
                        total = value;
                    }
                    else {
                        var op = operatorMap.Random(SecurityQuestion.Random);
                        string opAlias = operatorAliases[op.Key].Random(SecurityQuestion.Random);

                        questionText.AppendFormat(QuestionTextPartFormat, opAlias);
                        questionText.AppendFormat(QuestionTextPartFormat, value);
                        total = op.Value(total, value);
                    }
                }

                return new SecurityQuestion(GenerateKey(), questionText.ToString(), ((int)total).ToString());
            }

            public static SecurityQuestion GetByKey(string key) {
                if (SecurityQuestion.Cache.ContainsKey(key))
                    return SecurityQuestion.Cache.SingleOrDefault(o => string.Equals(o.Key, key)).Value;

                return null;
            }

            public static SecurityQuestion GetRandom() {
                string key = SecurityQuestion.Cache.Keys.Random(SecurityQuestion.Random);
                SecurityQuestion question = SecurityQuestion.Cache[key];

                return question;
            }
        }
    }
}