import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
//Styles
import "./edit_company_form.scss";
//Service
import CompanyInfoManager from "../../../Services/RailsApi/CompaniesFetch/CompanyInfoManager";
//components
import { UserStacksContext } from "../../../Context/UserStacksContext";
import ChipsArray from "../../FilterSystem/ChipsArray";
//MaterialUI
import TextField from "@mui/material/TextField";
import UIButton from "../../UIButton";
import { useTheme } from "@mui/material";
import { Card, CardContent, Select, Typography } from "@material-ui/core";
import { MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";

export const EditCompanyForm = () => {
  const companyId = useSelector((state) => state.user.id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [staffSize, setStaffSize] = useState("");
  const [isItRecruiting, setIsItRecruiting] = useState(null);
  const [websiteLink, setWebsiteLink] = useState("");
  const [companyCategoryId, setCompanyCategoryId] = useState(0);
  const [chipData, setChipData] = useState([]);

  const history = useHistory();
  const theme = useTheme();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: name,
      description: description,
      githubLink: githubLink,
      staffSize: staffSize,
      isItRecruiting: isItRecruiting,
      websiteLink: websiteLink,
      companyCategoryId: companyCategoryId
    },
  });

  const getCompanyDetail = async () => {
    const detail = await CompanyInfoManager.getDetails(companyId);
    setName(detail.data.name);
    setDescription(detail.data.description);
    setGithubLink(detail.data.github_link);
    setStaffSize(detail.data.staff_size);
    setIsItRecruiting(detail.data.is_it_recruiting);
    setWebsiteLink(detail.data.website_link);
    setCompanyCategoryId(detail.data.company_category_id);
    //getCompanyStacks(detail.data.company_stacks);
  };

  const getCompanyStacks = (list) => {
    let stacksList = new Set();
    list.map((companyStack) => {
      stacksList.add(companyStack.name);
    });
    stacksList = Array.from(stacksList);
    addExistingStacks(stacksList);
  };
  useEffect(() => {
    getCompanyDetail();
  }, []);

  const addExistingStacks = (list) => {
    let companyStackList = [];
    list.map((stack) => {
      companyStackList.push({ key: uuidv4(), label: stack });
      console.log(list);
    });
    setChipData(companyStackList);
  };
  console.log(chipData);
  const updateCompanyDetails = async () => {
    let variant = "success";
    let message = `Vos données ont été mises a jour !`;

    const response = await CompanyInfoManager.updateDetails(
      companyId,
      name,
      description,
      githubLink,
      staffSize,
      isItRecruiting,
      websiteLink,
      companyCategoryId,
    );
    enqueueSnackbar(message, { variant });
    Promise.resolve(response);
    history.push(`/company/dashboard`);
  };

  return (
    <UserStacksContext.Provider value={{ chipData, setChipData }}>
      <Typography variant="h5" color="primary">
        Modifier son profil
      </Typography>
      <Card>
        <CardContent>
          <form
            className="edit-form__container--company"
            onClick={() => {
              setValue("name", name);
              setValue("description", description);
              setValue("githubLink", githubLink);
              setValue("websiteLink", websiteLink);
              setValue("staffSize", staffSize);
              setValue("isItRecruiting", isItRecruiting);
              setValue("companyCategoryId", companyCategoryId);
            }}
            onSubmit={handleSubmit(updateCompanyDetails)}
          >
            <TextField
              theme={theme}
              sx={{ mt: 3 }}
              color="primary"
              label="Nom"
              variant="outlined"
              {...register("name", {
                required: "Nom d'entreprise requis",
              })}
              size="small"
              value={name ? name : ""}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p>{errors.name.message}</p>}
            <TextField
              theme={theme}
              sx={{ mt: 3 }}
              color="primary"
              label="Description"
              multiline
              maxRows={5}
              variant="outlined"
              {...register("description", {
                required: "Description requise",
                minLength: { value: 30, message: "Description trop courte" },
                maxLength: { value: 120, message: "Description trop longue" },
              })}
              size="small"
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p>{errors.description.message}</p>}
            <TextField
              theme={theme}
              sx={{ mt: 3 }}
              color="primary"
              label="Lien Github"
              variant="outlined"
              {...register("githubLink", {
                required: "Lien Github requis",
              })}
              size="small"
              value={githubLink ? githubLink : ""}
              onChange={(e) => setGithubLink(e.target.value)}
            />
            {errors.githubLink && <p>{errors.githubLink.message}</p>}
            <TextField
              theme={theme}
              sx={{ mt: 3 }}
              color="primary"
              label="Site Internet"
              variant="outlined"
              {...register("websiteLink", {
                required: "Lien requis",
                pattern: {
                  value:
                    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
                  message: "Format invalide",
                },
              })}
              size="small"
              value={websiteLink ? websiteLink : ""}
              onChange={(e) => setWebsiteLink(e.target.value)}
            />
            {errors.websiteLink && <p>{errors.websiteLink.message}</p>}
            <InputLabel id="Effectif">Effectif</InputLabel>
            <Select
              theme={theme}
              sx={{ mt: 3 }}
              labelId="Effectif"
              color="primary"
              label="Effectif"
              variant="outlined"
              {...register("staffSize", {
                required: "Effectif requis",
              })}
              size="large"
              value={staffSize ? staffSize : ""}
              onChange={(e) => setStaffSize(e.target.value)}
            >
              <MenuItem value="0-9">0-9</MenuItem>
              <MenuItem value="10-49">10-49</MenuItem>
              <MenuItem value="50-249">50-249</MenuItem>
              <MenuItem value="250+">250+</MenuItem>
            </Select>
            {errors.staffSize && <p>{errors.staffSize.message}</p>}
            <InputLabel id="Effectif">Type</InputLabel>
            <Select
              theme={theme}
              sx={{ mt: 3 }}
              labelId="Type"
              color="primary"
              label="Type"
              variant="outlined"
              {...register("companyCategoryId", {
                required: "Type requis",
              })}
              size="large"
              value={companyCategoryId ? companyCategoryId : null}
              onChange={(e) => setCompanyCategoryId(e.target.value)}
            >
              <MenuItem value={1}>startup</MenuItem>
              <MenuItem value={2}>classic</MenuItem>
              <MenuItem value={3}>it-services</MenuItem>
              <MenuItem value={4}>web-agency</MenuItem>
              <MenuItem value={5}>big-tech-agency</MenuItem>
            </Select>
            {errors.companyCategory && <p>{errors.companyCategory.message}</p>}
            <Checkbox
              defaultChecked={isItRecruiting ? isItRecruiting : ""}
              //value={isItRecruiting ? isItRecruiting : ""}
              {...register("isItRecruiting")}
              onChange={() => setIsItRecruiting(!!!isItRecruiting)}
            />
            {errors.isItRecruiting && <p>{errors.isItRecruiting.message}</p>}
            <div className="container--cta">
              <UIButton
                color="primary"
                size="small"
                variant="contained"
                content="Sauvegarder"
                type="submit"
              />
            </div>
          </form>
          <div className="container--chips">
            <ChipsArray />
          </div>
        </CardContent>
      </Card>
    </UserStacksContext.Provider>
  );
};
