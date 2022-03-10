import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ICorporativo, IDetailCorporate, IHeaderCorporate, ITwContactCoporate } from './_models/user-edit';
import { UserEditService } from './_services/user-edit.service';
import swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss', '/assets/sass/pages/page-users.scss', '/assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersEditComponent implements OnInit, OnDestroy {

  formDetailsCorporation: FormGroup = new FormGroup({
    S_NombreCorto: new FormControl(),
    S_NombreCompleto: new FormControl(),
    S_Activo: new FormControl(2, Validators.required),
    D_FechaIncorporacion: new FormControl('', Validators.required),
    S_SystemUrl: new FormControl('', Validators.required),
    id: new FormControl(),
    FK_Asignado_id: new FormControl()
  })
  headerDetailsCorporation: IHeaderCorporate
  data: ICorporativo

  formContact: FormGroup = new FormGroup({
    S_Nombre: new FormControl('', Validators.required),
    S_Puesto: new FormControl(),
    S_Comentarios: new FormControl(),
    N_TelefonoFijo: new FormControl(),
    N_TelefonoMovil: new FormControl(),
    S_Email: new FormControl(),
    tw_corporativo_id: new FormControl()
  })
  textBtnContact: 'AGREGAR CONTACTO' | 'ACTUALIZAR CONTACTO' = 'AGREGAR CONTACTO'
  indexEditContact: number;

  suscriptions: Subscription[] = []

  constructor(
    private userDetailsServise: UserEditService,
    private activeRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.formDetailsCorporation.disable()
    this.suscriptions[0] = this.userDetailsServise.getDetailUser(this.activeRoute.snapshot.params.id).subscribe(data => {
      this.data = data.data
      this.setFGDetailsCorporation(this.data)
      this.setHeaderDetailsCorporation(this.data)
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    })
  }
  ngOnDestroy(): void {
    this.suscriptions.forEach(suscription => {
      suscription.unsubscribe()
    })
  }


  // Public Methods para el tap: Datos Generales
  // -----------------------------------------------------------------------------------------------------

  /**
   * setFGDetailsCorporation
   * @param data
   * @description Carga los valores del servicio del api /corporativos/:id
   */
  setFGDetailsCorporation(data: IDetailCorporate) {
    this.formDetailsCorporation.setValue({
      S_NombreCorto: data.S_NombreCorto,
      S_NombreCompleto: data.S_NombreCompleto,
      S_Activo: data.S_Activo,
      D_FechaIncorporacion: new DatePipe('en-US').transform(data.D_FechaIncorporacion, 'yyyy-MM-dd'),
      S_SystemUrl: data.S_SystemUrl,
      id: data.id,
      FK_Asignado_id: data.FK_Asignado_id
    })
  }


  /**
   * setHeaderDetailsCorporation
   * @param data
   * @description Carga los valores del servicio del api /corporativos/:id
   */
  setHeaderDetailsCorporation(data: IHeaderCorporate) {
    this.headerDetailsCorporation = data
  }


  /**
   * actionOne
   * @description Condicional para verificar acción del boton (REGRESAR | CANCELAR)
   */
  actionOne() {
    if (this.getTextBtnOne == 'Regresar') {
      this.router.navigate(['../corporativos'])
    } else {
      this.setFGDetailsCorporation(this.data)
      this.formDetailsCorporation.disable()
    }
  }


  /**
   * actionTwo
   * @description Condicional para verificar acción del boton (EDITAR | GUARDAR CAMBIOS)
   */
  actionTwo() {
    if (this.getTextBtnTwo == 'Editar') {
      this.formDetailsCorporation.enable()
    } else {
      this.putDetailCorporate()
    }
  }


  /**
   * putDetailCorporate
   * @description Actualiza la información del formulario de Datos Generales
   */
  putDetailCorporate() {
    this.spinner.show();
    this.suscriptions[1] = this.userDetailsServise.putDetailCorporate(this.formDetailsCorporation.value).subscribe(success => {
      this.data = { ...this.data, ...success }
      this.setFGDetailsCorporation(this.data)
      this.formDetailsCorporation.disable()
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }

      , (error) => {
        this.spinner.hide();
        swal.fire({
          title: "¡Error!",
          text: "Fallo de comunicación",
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
        });
      })
  }


  /**
   * get getTextBtnOne
   * @description Retorna texto del boton (REGRESAR | CANCELAR)
   */
  public get getTextBtnOne(): string {
    return this.formDetailsCorporation.disabled ? 'Regresar' : 'Cancelar'
  }

  /**
   * get getTextBtnTwo
   * @description Retorna texto del boton (EDITAR | GUARDAR CAMBIOS)
   */
  public get getTextBtnTwo(): string {
    return this.formDetailsCorporation.disabled ? 'Editar' : 'Guardar Cambios'
  }





  // Public Methods para el tap: Contactos
  // -----------------------------------------------------------------------------------------------------

  /**
   * setInfoContact
   * @description Actualiza texto del boton (AGREGAR CONTACTO | ACTUALIZAR CONTACTO)
   */
  setInfoContact(contact: ITwContactCoporate, index: number) {
    this.indexEditContact = index
    this.textBtnContact = 'ACTUALIZAR CONTACTO'
    this.formContact.setValue({
      S_Nombre: contact.S_Nombre,
      S_Puesto: contact.S_Puesto,
      S_Comentarios: contact.S_Comentarios,
      N_TelefonoFijo: contact.N_TelefonoFijo,
      N_TelefonoMovil: contact.N_TelefonoMovil,
      S_Email: contact.S_Email,
      tw_corporativo_id: contact.tw_corporativo_id
    })
  }


  /**
   * addContact
   * @description Agrega contacto a la lista de contactos corporativos
   */
  addContact() {
    this.spinner.show();
    this.suscriptions[2] = this.userDetailsServise.postContact({ ...this.formContact.value, tw_corporativo_id: this.data.id }).subscribe(success => {
      this.data.tw_contactos_corporativo.push(success)
      this.formContact.reset()
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }

      , (error) => {
        this.spinner.hide();
        swal.fire({
          title: "¡Error!",
          text: "Fallo de comunicación",
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
        });
      })
  }


  /**
   * editContact
   * @description Edita contacto de la lista de contactos corporativos
   */
  editContact() {
    this.spinner.show();
    this.suscriptions[3] = this.userDetailsServise.putContact({ ...this.formContact.value, id: this.data.tw_contactos_corporativo[this.indexEditContact].id }).subscribe(success => {
      this.data.tw_contactos_corporativo[this.indexEditContact] = success
      this.formContact.reset()
      this.textBtnContact = 'AGREGAR CONTACTO'
      setTimeout(() => {
        this.spinner.hide();
      }, 1000);
    }, (error) => {
      this.spinner.hide();
      swal.fire({
        title: "¡Error!",
        text: "Fallo de comunicación",
        icon: "error",
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false,
      });
    })
  }


  /**
   * deleteContact
   * @param ID
   * @param index
   * @description Elimina contacto de la lista de contactos corporativos
   */
  deleteContact(ID: number, index: number) {
    this.spinner.show();
    swal.fire({
      icon: 'warning',
      title: '¡Advertencia!',
      text: 'Estas seguro de eliminar el contacto',
      showConfirmButton: true,
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-2'
      },
      buttonsStyling: false,
      confirmButtonText: 'SI',
      cancelButtonText: 'NO'
    }).then(value => {
      if (typeof value.value !== 'undefined') {
        this.suscriptions[4] = this.userDetailsServise.deleteContact(ID).subscribe(success => {
          if (success.data == "Borrado correctamente") {
            this.data.tw_contactos_corporativo.splice(index, 1)
          }
          setTimeout(() => {
            this.spinner.hide();
          }, 1000);
        }, (error) => {
          this.spinner.hide();
          swal.fire({
            title: "¡Error!",
            text: "Fallo de comunicación",
            icon: "error",
            customClass: {
              confirmButton: 'btn btn-primary'
            },
            buttonsStyling: false,
          });
        })
      }
    })
  }


  /**
   * actionBtnContact
   * @description Condicional para verificar acción del boton (AGREGAR CONTACTO | ACTUALIZAR CONTACTO)
   */
  actionBtnContact() {
    if (this.textBtnContact == 'AGREGAR CONTACTO') {
      this.addContact()
    } else {
      this.editContact()
    }
  }


  /**
   * get getUrlAvatar
   * @description Retorna una ImgURL en caso de que la propiedad S_LogoURL no este configurada
   */
  public get getUrlAvatar(): string {
    let url = typeof this.headerDetailsCorporation?.S_LogoURL === 'string' ? this.headerDetailsCorporation?.S_LogoURL : 'https://icons.veryicon.com/png/o/system/ued_v10-of-shengye-group/general-user-name-icon.png'
    return url
  }


}
